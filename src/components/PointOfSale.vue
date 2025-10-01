<template>
  <div class="pos-container">
    <PosHeader 
      :posView="posView" 
      :selectedTable="selectedTable"
      @setView="$emit('setView', $event)" 
      @setPosView="posView = $event"
      @openTableModal="isTableModalVisible = true" 
    />

    <div class="pos-main" :class="{ 'single-column-layout': posView === 'reservations' }">
      <CategorySidebar v-if="posView === 'menu'" :activeCategory="activeCategory" @update:activeCategory="activeCategory = $event" />

      <main class="main-content">
        <div v-if="posView === 'menu'" class="menu-grid">
          <MenuItemCard v-for="item in filteredMenu" :key="item.id" :item="item" @addToCart="addToCart" />
        </div>
        <ReservationManagement v-else />
      </main>

      <CartSidebar 
        v-if="posView === 'menu'" 
        :cartItems="cartCalculation.items"
        :subtotal="cartCalculation.subtotal"
        :total="cartCalculation.total"
        :appliedDeals="cartCalculation.appliedDeals"
        :gifts="cartCalculation.gifts"
        :promotionHints="cartCalculation.promotionHints"
        :selectedTable="selectedTable" 
        @decreaseQuantity="decreaseQuantity" 
        @increaseQuantity="increaseQuantity" 
        @checkout="checkout" 
      />
    </div>

    <!-- Modals -->
    <!-- 
      核心改動: 優化結帳彈窗 (Optimized Checkout Modal)
      - 放大彈窗尺寸 (Enlarged modal size)
      - 將按鈕改為大型塊狀點擊區 (Button to large block tappable area)
      - 嵌入 SVG 圖示 (Embedded SVG icons)
    -->
    <div v-if="showCheckoutModal" class="checkout-modal">
        <div class="modal-content">
            <h3>選擇付款方式</h3>
            <div class="payment-options">
                <!-- Cash Option -->
                <button class="payment-option btn-cash" @click="processOrder('cash')">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><circle cx="12" cy="12" r="4"></circle></svg>
                    <span>現金結帳</span>
                </button>
                <!-- LinePay Option -->
                <button class="payment-option btn-linepay" @click="processOrder('linepay')">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 2H7C5.89543 2 5 2.89543 5 4V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V4C19 2.89543 18.1046 2 17 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9 7H10V8H9V7Z" fill="currentColor"/><path d="M11 7H12V8H11V7Z" fill="currentColor"/><path d="M13 7H15V8H13V7Z" fill="currentColor"/><path d="M9 9H10V11H9V9Z" fill="currentColor"/><path d="M11 9H12V10H11V9Z" fill="currentColor"/><path d="M13 9H14V10H13V9Z" fill="currentColor"/><path d="M14 10H15V11H14V10Z" fill="currentColor"/><path d="M9 12H11V13H9V12Z" fill="currentColor"/><path d="M12 12H13V14H12V12Z" fill="currentColor"/><path d="M14 12H15V13H14V12Z" fill="currentColor"/><path d="M10 14H11V15H10V14Z" fill="currentColor"/><path d="M13 14H14V15H13V14Z" fill="currentColor"/><path d="M9 16H10V17H9V16Z" fill="currentColor"/><path d="M11 16H13V17H11V16Z" fill="currentColor"/><path d="M14 16H15V17H14V16Z" fill="currentColor"/>
                    </svg>
                    <span>LinePay</span>
                </button>
            </div>
            <button class="btn btn-secondary" @click="showCheckoutModal = false">取消</button>
        </div>
    </div>
    <SetMealModal :visible="isSetMealModalVisible" :set-meal="selectedSetMeal" @close="isSetMealModalVisible = false" @confirm="handleSetMealConfirm" />
    <SelectTableModal :is-visible="isTableModalVisible" @close="isTableModalVisible = false" @select-table="handleTableSelected" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useOrdersStore } from '../stores/orders';
import { useMenuStore } from '../stores/menu';
import { usePromotionsStore, type SingleItemDeal, type SpendAndDiscount, type SpendAndGet } from '../stores/promotions';
import SetMealModal from './SetMealModal.vue';
import ReservationManagement from './ReservationManagement.vue';
import SelectTableModal from './SelectTableModal.vue';
import PosHeader from './PosHeader.vue';
import CategorySidebar from './CategorySidebar.vue';
import MenuItemCard from './MenuItemCard.vue';
import CartSidebar from './CartSidebar.vue';

const props = defineProps<{ view: string }>();
const emit = defineEmits(['setView']);

const ordersStore = useOrdersStore();
const menuStore = useMenuStore();
const promotionsStore = usePromotionsStore();

const { items: menuItems, allCategories } = storeToRefs(menuStore);
const { activePromotions } = storeToRefs(promotionsStore);

const posView = ref(props.view === 'reservations' ? 'reservations' : 'menu');
const activeCategory = ref('全部');
const cart = ref<any[]>([]);
const showCheckoutModal = ref(false);
const isSetMealModalVisible = ref(false);
const isTableModalVisible = ref(false);
const selectedSetMeal = ref<any>(null);
const selectedTable = ref<any>(null);
let cartIdCounter = 0;

const filteredMenu = computed(() => {
  if (activeCategory.value === '全部') {
    return menuItems.value.filter(item => item.inStock);
  }
  return menuItems.value.filter(item => item.category === activeCategory.value && item.inStock);
});

watch(allCategories, (newCategories) => {
  if (!newCategories.includes(activeCategory.value)) {
    activeCategory.value = '全部';
  }
}, { immediate: true });

const cartCalculation = computed(() => {
  const subtotal = cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const appliedDeals: string[] = [];
  const gifts: string[] = [];
  const promotionHints: string[] = [];
  const processedItems = JSON.parse(JSON.stringify(cart.value));

  const singleItemDeals = activePromotions.value.filter(p => p.type === 'SINGLE_ITEM_DEAL') as SingleItemDeal[];
  if (singleItemDeals.length > 0) {
    processedItems.forEach(item => {
      const applicableDeal = singleItemDeals.find(deal => deal.itemId === item.id);
      if (applicableDeal) {
        item.discountedPrice = applicableDeal.discountPrice;
        if (!appliedDeals.includes(applicableDeal.name)) {
          appliedDeals.push(applicableDeal.name);
        }
      }
    });
  }
  
  let total = processedItems.reduce((sum, item) => sum + (item.discountedPrice || item.price) * item.quantity, 0);

  const spendAndDiscountDeals = activePromotions.value.filter(p => p.type === 'SPEND_AND_DISCOUNT') as SpendAndDiscount[];
  let appliedDiscount = false;
  if (spendAndDiscountDeals.length > 0) {
    const applicableDiscount = spendAndDiscountDeals
      .filter(deal => subtotal >= deal.threshold)
      .sort((a, b) => a.discount - b.discount)[0]; 
    
    if (applicableDiscount) {
      total = Math.round(total * (applicableDiscount.discount / 100));
      if (!appliedDeals.includes(applicableDiscount.name)) {
          appliedDeals.push(applicableDiscount.name);
      }
      appliedDiscount = true;
    }
  }

  const spendAndGetDeals = activePromotions.value.filter(p => p.type === 'SPEND_AND_GET') as SpendAndGet[];
  let appliedGift = false;
  if (spendAndGetDeals.length > 0) {
      const applicableGift = spendAndGetDeals
        .filter(deal => subtotal >= deal.threshold)
        .sort((a, b) => b.threshold - a.threshold)[0];

      if(applicableGift) {
          gifts.push(applicableGift.giftName);
          if (!appliedDeals.includes(applicableGift.name)) {
            appliedDeals.push(applicableGift.name);
          }
          appliedGift = true;
      }
  }
  
  if (!appliedDiscount && spendAndDiscountDeals.length > 0) {
      const nextDiscountDeal = spendAndDiscountDeals
          .filter(deal => subtotal < deal.threshold)
          .sort((a, b) => a.threshold - b.threshold)[0];
      if (nextDiscountDeal) {
          const difference = nextDiscountDeal.threshold - subtotal;
          promotionHints.push(`再消費 NT$${difference} 即可享有「${nextDiscountDeal.name}」！`);
      }
  }

  if (!appliedGift && spendAndGetDeals.length > 0) {
      const nextGiftDeal = spendAndGetDeals
          .filter(deal => subtotal < deal.threshold)
          .sort((a, b) => a.threshold - b.threshold)[0];
      if (nextGiftDeal) {
          const difference = nextGiftDeal.threshold - subtotal;
          promotionHints.push(`再消費 NT$${difference} 即可獲得「${nextGiftDeal.giftName}」！`);
      }
  }

  return {
    items: processedItems,
    subtotal: Math.round(subtotal),
    total: total, 
    appliedDeals,
    gifts,
    promotionHints
  };
});

const addToCart = (item: any) => {
  if (item.isSetMeal) {
    selectedSetMeal.value = item;
    isSetMealModalVisible.value = true;
  } else {
    const existingItem = cart.value.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.value.push({ ...item, quantity: 1, cartItemId: `cart-item-${cartIdCounter++}` });
    }
  }
};

const handleSetMealConfirm = (mealPackage: any[]) => {
  mealPackage.forEach(item => {
    const existingItem = cart.value.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.value.push({ ...item, quantity: 1, cartItemId: `cart-item-${cartIdCounter++}` });
    }
  });
  isSetMealModalVisible.value = false;
};

const increaseQuantity = (item: any) => {
  item.quantity++;
};

const decreaseQuantity = (item: any) => {
  item.quantity--;
  if (item.quantity === 0) {
    cart.value = cart.value.filter(cartItem => cartItem.cartItemId !== item.cartItemId);
  }
};

const checkout = () => {
  if (cart.value.length > 0 && selectedTable.value) {
    showCheckoutModal.value = true;
  } else {
    alert("請先選擇桌號再進行結帳。");
  }
};

const handleTableSelected = (table: any) => {
  selectedTable.value = table;
  isTableModalVisible.value = false;
};

const processOrder = (paymentMethod: 'cash' | 'linepay') => {
  const { items, total, gifts } = cartCalculation.value;

  let finalCartItems = [...items];

  gifts.forEach(giftName => {
    finalCartItems.push({ 
      id: `gift-${Date.now()}`,
      name: giftName, 
      price: 0, 
      quantity: 1,
      isGift: true 
    });
  });

  const orderPayload = {
    items: finalCartItems.map(item => ({
      id: item.id,
      name: item.name,
      price: item.discountedPrice ?? item.price,
      quantity: item.quantity,
      isGift: item.isGift || false,
    })),
    total: total,
    paymentMethod: paymentMethod,
    tableNumber: selectedTable.value ? selectedTable.value.name : undefined
  };

  ordersStore.addOrder(orderPayload);
  
  cart.value = [];
  showCheckoutModal.value = false;
  selectedTable.value = null; 
  emit('setView', 'dashboard');
};

</script>

<style scoped>
.pos-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #f8f9fa;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.pos-main {
  display: grid;
  grid-template-columns: auto 1fr auto;
  flex-grow: 1;
  gap: 25px;
  padding: 25px;
  overflow: hidden;
}

.pos-main.single-column-layout {
  grid-template-columns: 1fr;
}

.main-content {
  overflow-y: auto;
}

.single-column-layout>.main-content {
  grid-column: 1 / -1;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 25px;
  align-content: start;
}

/* --- Checkout Modal Styles --- */

.checkout-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 90%;
  max-width: 600px;
  transform: scale(1.05);
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 30px;
  font-size: 28px;
  color: var(--text-dark);
}

.payment-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin: 30px 0;
}

.payment-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
  border-radius: 15px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  font-size: 22px;
  font-weight: 600;
}

.payment-option svg {
  margin-bottom: 15px;
  width: 60px;
  height: 60px;
}

.payment-option:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.btn-cash {
  background-color: #48bb78;
}

.btn-cash:hover {
    background-color: #3f9e68;
}

.btn-linepay {
  background-color: #00B900;
}

.btn-linepay:hover {
    background-color: #00a300;
}


.btn-secondary {
  background-color: #a0aec0;
  color: white;
  width: 100%;
  padding: 15px;
  font-size: 18px;
  margin-top: 20px;
}
</style>