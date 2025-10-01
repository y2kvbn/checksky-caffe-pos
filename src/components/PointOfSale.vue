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

      <!-- 
        核心改動 1: 傳遞新的 prop `promotionHints` 給 CartSidebar 
      -->
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
    <div v-if="showCheckoutModal" class="checkout-modal">
        <div class="modal-content">
            <h3>選擇付款方式</h3>
            <div class="payment-options">
                <button class="btn btn-success" @click="processOrder('cash')">現金結帳</button>
                <button class="btn btn-linepay" @click="processOrder('linepay')">LinePay</button>
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

// 
// --- 智慧計算引擎 v3.0 (包含 Bug 修復 和 提示功能) ---
//
const cartCalculation = computed(() => {
  // 步驟 1: 計算原始小計 (這是判斷所有滿額活動的唯一標準)
  const subtotal = cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const appliedDeals: string[] = [];
  const gifts: string[] = [];
  const promotionHints: string[] = []; // 新增: 優惠提示列表
  const processedItems = JSON.parse(JSON.stringify(cart.value));

  // 步驟 2: 套用 "單品折扣"
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
  
  // 步驟 3: 計算經過 "單品折扣" 後的總計
  let total = processedItems.reduce((sum, item) => sum + (item.discountedPrice || item.price) * item.quantity, 0);

  // --- 邏輯修正開始 ---
  // 所有 "滿額" 活動的門檻，都以 "原始小計 (subtotal)" 作為判斷標準

  // 步驟 4: 處理 "滿額折扣" (Spend and Discount)
  const spendAndDiscountDeals = activePromotions.value.filter(p => p.type === 'SPEND_AND_DISCOUNT') as SpendAndDiscount[];
  let appliedDiscount = false;
  if (spendAndDiscountDeals.length > 0) {
    const applicableDiscount = spendAndDiscountDeals
      .filter(deal => subtotal >= deal.threshold) // <-- 修正: 使用 subtotal 判斷
      .sort((a, b) => a.discount - b.discount)[0]; 
    
    if (applicableDiscount) {
      total = Math.round(total * (applicableDiscount.discount / 100));
      if (!appliedDeals.includes(applicableDiscount.name)) {
          appliedDeals.push(applicableDiscount.name);
      }
      appliedDiscount = true;
    }
  }

  // 步驟 5: 處理 "滿額贈品" (Spend and Get)
  const spendAndGetDeals = activePromotions.value.filter(p => p.type === 'SPEND_AND_GET') as SpendAndGet[];
  let appliedGift = false;
  if (spendAndGetDeals.length > 0) {
      const applicableGift = spendAndGetDeals
        .filter(deal => subtotal >= deal.threshold) // <-- 修正: 使用 subtotal 判斷
        .sort((a, b) => b.threshold - a.threshold)[0];

      if(applicableGift) {
          gifts.push(applicableGift.giftName);
          if (!appliedDeals.includes(applicableGift.name)) {
            appliedDeals.push(applicableGift.name);
          }
          appliedGift = true;
      }
  }
  
  // --- 新功能: 產生優惠提示 ---

  // 提示 1: 顯示尚未達成的 "滿額折扣"
  if (!appliedDiscount && spendAndDiscountDeals.length > 0) {
      const nextDiscountDeal = spendAndDiscountDeals
          .filter(deal => subtotal < deal.threshold) // 找出所有未達成的
          .sort((a, b) => a.threshold - b.threshold)[0]; // 找出最接近的下一個門檻
      if (nextDiscountDeal) {
          const difference = nextDiscountDeal.threshold - subtotal;
          promotionHints.push(`再消費 NT$${difference} 即可享有「${nextDiscountDeal.name}」！`);
      }
  }

  // 提示 2: 顯示尚未達成的 "滿額贈品"
  if (!appliedGift && spendAndGetDeals.length > 0) {
      const nextGiftDeal = spendAndGetDeals
          .filter(deal => subtotal < deal.threshold) // 找出所有未達成的
          .sort((a, b) => a.threshold - b.threshold)[0]; // 找出最接近的下一個門檻
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
    promotionHints // 新增: 回傳提示列表
  };
});

// (其餘 <script> 內容維持不變...)

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
/* 樣式維持不變 */
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

.checkout-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 40px;
  border-radius: 15px;
  box-shadow: var(--shadow);
  text-align: center;
}

.modal-content h3 {
  margin-top: 0;
  font-size: 24px;
}

.payment-options {
  display: flex;
  gap: 20px;
  margin: 25px 0;
}

.btn-success {
  background-color: #48bb78;
  color: white;
}

.btn-linepay {
  background-color: #00B900;
  color: white;
}

.btn-secondary {
  background-color: #a0aec0;
  color: white;
  width: 100%;
}
</style>
