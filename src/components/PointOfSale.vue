<template>
  <div class="pos-container">
    <PosHeader :posView="posView" @setView="$emit('setView', $event)" @setPosView="posView = $event" />

    <div class="pos-main" :class="{ 'single-column-layout': posView === 'reservations' }">
      <CategorySidebar v-if="posView === 'menu'" :activeCategory="activeCategory" @update:activeCategory="activeCategory = $event" />

      <main class="main-content">
        <div v-if="posView === 'menu'" class="menu-grid">
          <MenuItemCard v-for="item in filteredMenu" :key="item.id" :item="item" @addToCart="addToCart" />
        </div>
        <ReservationManagement v-else />
      </main>

      <CartSidebar v-if="posView === 'menu'" :cart="cart" :selectedTable="selectedTable" @openTableModal="isTableModalVisible = true" @decreaseQuantity="decreaseQuantity" @increaseQuantity="increaseQuantity" @checkout="checkout" />
    </div>

    <!-- Checkout Modal -->
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

    <!-- Set Meal Configuration Modal -->
    <SetMealModal :visible="isSetMealModalVisible" :set-meal="selectedSetMeal" @close="isSetMealModalVisible = false" @confirm="handleSetMealConfirm" />

    <!-- Select Table Modal -->
    <SelectTableModal :is-visible="isTableModalVisible" @close="isTableModalVisible = false" @select-table="handleTableSelected" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useOrdersStore } from '../stores/orders';
import { useMenuStore } from '../stores/menu';
import { usePromotionsStore } from '../stores/promotions';
import { useSettingsStore } from '../stores/settings';
import { useTablesStore } from '../stores/tables';
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
const settingsStore = useSettingsStore();
const tablesStore = useTablesStore(); // eslint-disable-line

const { items: menuItems, allCategories } = storeToRefs(menuStore);
const { singleItemDeal, spendAndGet, spendAndDiscount } = storeToRefs(promotionsStore);
const { receiptNotes } = storeToRefs(settingsStore);

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

const cartWithPromotions = computed(() => {
  let processedCart = cart.value.map(item => ({
    ...item,
    discountedPrice: item.price
  }));

  if (singleItemDeal.value.enabled && singleItemDeal.value.itemId) {
    processedCart.forEach(item => {
      if (item.id === singleItemDeal.value.itemId) {
        item.discountedPrice = singleItemDeal.value.discountPrice;
      }
    });
  }

  return processedCart;
});

const cartSubtotalAfterSingleItemDiscount = computed(() => {
  return cartWithPromotions.value.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0);
});

const isDiscountThresholdMet = computed(() => {
  return spendAndDiscount.value.enabled && cartSubtotalAfterSingleItemDiscount.value >= spendAndDiscount.value.threshold;
});

const isGiftThresholdMet = computed(() => {
  return spendAndGet.value.enabled && cartSubtotalAfterSingleItemDiscount.value >= spendAndGet.value.threshold;
});

const total = computed(() => {
  let finalTotal = cartSubtotalAfterSingleItemDiscount.value;

  if (isDiscountThresholdMet.value) {
    const discountMultiplier = 1 - (spendAndDiscount.value.discount / 100);
    finalTotal *= discountMultiplier;
  }

  return Math.round(finalTotal);
});

const subtotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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

const processOrder = (paymentMethod: string) => {
  let finalCart = [...cartWithPromotions.value];
  let appliedPromotion = {
    singleItem: singleItemDeal.value.enabled ? `特定品項優惠` : '無',
    spendAndGet: '無',
    spendAndDiscount: '無',
  };

  if (isGiftThresholdMet.value) {
    finalCart.push({ name: spendAndGet.value.giftName, price: 0, isGift: true });
    appliedPromotion.spendAndGet = `滿額贈 ${spendAndGet.value.giftName}`;
  }

  if (isDiscountThresholdMet.value) {
    appliedPromotion.spendAndDiscount = `滿額${spendAndDiscount.value.discount}折`;
  }

  const newOrder = {
    items: JSON.parse(JSON.stringify(finalCart)),
    subtotal: subtotal.value,
    total: total.value,
    paymentMethod: paymentMethod,
    appliedPromotion: appliedPromotion,
    timestamp: new Date().toISOString(),
    receiptNotes: receiptNotes.value,
    table: selectedTable.value ? selectedTable.value.name : '未指定' // Add table name to order
  };

  ordersStore.addOrder(newOrder);
  cart.value = [];
  showCheckoutModal.value = false;
  selectedTable.value = null; // Reset selected table
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
  /* This is necessary to contain the children */
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
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
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
