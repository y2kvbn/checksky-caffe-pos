
<template>
  <div class="pos-container">
    <!-- Header -->
    <header class="pos-header">
        <button class="btn btn-outline" @click="$emit('setView', 'dashboard')"><span>&#128187;</span> 返回儀表板</button>
        <h1 class="logo">向天泓咖啡廳</h1>
        <div>
            <button class="btn btn-outline" @click="posView = 'reservations'" :class="{ active: posView === 'reservations' }"><span>&#128197;</span> 訂位總覽</button>
            <button v-if="posView === 'reservations'" class="btn btn-outline" @click="posView = 'menu'"><span>&#127869;</span> 返回點餐</button>
            <button v-else class="btn btn-outline" @click="posView = 'menu'" :class="{ active: posView === 'menu' }"><span>&#127869;</span> 點餐</button>
        </div>
    </header>
    
    <div class="pos-main" :class="{ 'single-column-layout': posView === 'reservations' }">
      <!-- Category Sidebar (shown only in menu view) -->
      <aside class="category-sidebar" v-if="posView === 'menu'">
        <h2>分類</h2>
        <ul class="category-list">
          <li 
            v-for="category in allCategories" 
            :key="category" 
            :class="{ active: category === activeCategory }" 
            @click="activeCategory = category"
          >
            {{ category }}
          </li>
        </ul>
      </aside>
      
      <!-- Main Content: Menu Grid or Reservation Management -->
      <main class="main-content">
        <div v-if="posView === 'menu'" class="menu-grid">
            <div class="menu-item-card" v-for="item in filteredMenu" :key="item.id">
                <img :src="item.image" :alt="item.name" />
                <div class="item-info">
                    <h3>{{ item.name }}</h3>
                    <p>{{ item.category }}</p>
                </div>
                <div class="item-actions">
                    <span class="price">NT${{ item.price }}</span>
                    <button class="btn btn-primary" @click="addToCart(item)"><span>&#8853;</span> 加入</button>
                </div>
            </div>
        </div>
        <ReservationManagement v-else />
      </main>

      <!-- Cart Sidebar (shown only in menu view) -->
      <aside class="cart-sidebar" v-if="posView === 'menu'">
        <div class="cart">
          <h2>我的購物車</h2>
          <div class="table-selection-wrapper">
              <div v-if="selectedTable" class="table-display">
                  <span>桌號: <strong>{{ selectedTable.name }}</strong></span>
                  <button @click="isTableModalVisible = true">更換</button>
              </div>
              <button v-else class="btn btn-secondary" @click="isTableModalVisible = true">&#128442; 選擇桌號</button>
          </div>
          <div class="cart-body">
            <div v-if="cart.length === 0" class="cart-empty">
              <p>購物車是空的</p>
            </div>
            <div v-else class="cart-items">
              <div class="cart-item" v-for="item in cartWithPromotions" :key="item.cartItemId">
                  <div class="item-info-cart">
                      <span class="item-name">{{ item.name }} <span v-if="item.isGift" class="gift-tag">[贈品]</span></span>
                      <span class="item-price" :class="{ 'original-price': item.discountedPrice !== item.price }">NT${{ item.price }}</span>
                      <span v-if="item.discountedPrice !== item.price" class="discounted-price">NT${{ item.discountedPrice }}</span>
                  </div>
                  <div class="item-quantity-controls">
                      <button @click="decreaseQuantity(item)">-</button>
                      <span>{{ item.quantity }}</span>
                      <button @click="increaseQuantity(item)">+</button>
                  </div>
              </div>
            </div>
          </div>
          <div class="cart-summary">
            <div class="summary-item">
              <span>小計:</span>
              <span>NT${{ subtotal }}</span>
            </div>
            <div class="promo-messages-container">
              <div v-if="spendAndDiscountMessage" class="promo-message discount">
                  <p>&#127881; {{ spendAndDiscountMessage }}</p>
              </div>
              <div v-if="spendAndGetMessage" class="promo-message gift">
                  <p>&#127873; {{ spendAndGetMessage }} <span v-if="isGiftThresholdMet" class="gift-achieved">(已達成)</span></p>
              </div>
            </div>
            <div class="summary-total">
              <span>總計:</span>
              <span>NT${{ total }}</span>
            </div>
            <button class="btn btn-confirm" @click="checkout" :disabled="!selectedTable">前往結帳</button>
          </div>
        </div>
      </aside>
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
    <SetMealModal 
      :visible="isSetMealModalVisible" 
      :set-meal="selectedSetMeal" 
      @close="isSetMealModalVisible = false"
      @confirm="handleSetMealConfirm"
    />
    
    <!-- Select Table Modal -->
    <SelectTableModal 
        :is-visible="isTableModalVisible" 
        @close="isTableModalVisible = false"
        @select-table="handleTableSelected"
    />
  </div>
</template>

<script setup>
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

const props = defineProps({
  view: {
    type: String,
    default: 'menu'
  }
});
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
const cart = ref([]);
const showCheckoutModal = ref(false);
const isSetMealModalVisible = ref(false);
const isTableModalVisible = ref(false);
const selectedSetMeal = ref(null);
const selectedTable = ref(null);
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

const subtotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

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

const spendAndDiscountMessage = computed(() => {
    if (!spendAndDiscount.value.enabled) return '';
    return `滿${spendAndDiscount.value.threshold}元享${spendAndDiscount.value.discount}折優惠。`;
});

const isGiftThresholdMet = computed(() => {
    return spendAndGet.value.enabled && cartSubtotalAfterSingleItemDiscount.value >= spendAndGet.value.threshold;
});

const spendAndGetMessage = computed(() => {
    if (!spendAndGet.value.enabled) return '';
    return `滿${spendAndGet.value.threshold}元贈送${spendAndGet.value.giftName}。`;
});

const total = computed(() => {
  let finalTotal = cartSubtotalAfterSingleItemDiscount.value;

  if (isDiscountThresholdMet.value) {
    const discountMultiplier = 1 - (spendAndDiscount.value.discount / 100);
    finalTotal *= discountMultiplier;
  }

  return Math.round(finalTotal);
});

const addToCart = (item) => {
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

const handleSetMealConfirm = (mealPackage) => {
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

const increaseQuantity = (item) => {
    item.quantity++;
};

const decreaseQuantity = (item) => {
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

const handleTableSelected = (table) => {
  selectedTable.value = table;
  isTableModalVisible.value = false;
};

const processOrder = (paymentMethod) => {
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
.pos-main {
  display: grid;
  grid-template-columns: auto 1fr auto;
  flex-grow: 1;
  overflow: hidden;
  gap: 25px;
  padding: 25px;
}

.pos-main.single-column-layout {
  grid-template-columns: 1fr;
}

.main-content {
  overflow-y: auto;
}

.single-column-layout > .main-content {
    grid-column: 1 / -1;
}

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

.pos-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 30px;
  background-color: var(--tertiary-color);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-soft);
  z-index: 10;
  flex-shrink: 0;
}

.pos-header .logo {
  color: #4eb8d7;
  font-size: 28px;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(78, 184, 215, 0.5);
}

.pos-header div {
    display: flex;
    gap: 15px;
}

.category-sidebar {
  background-color: #fff;
  padding: 25px;
  border-radius: 12px;
  box-shadow: var(--shadow-soft);
  width: 240px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.category-sidebar h2 {
  font-size: 22px;
  color: var(--text-dark);
  margin-top: 0;
  margin-bottom: 25px;
  flex-shrink: 0;
}

.category-sidebar .category-list {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto; 
  flex-grow: 1;
}

.category-sidebar li {
  padding: 14px 18px;
  margin-bottom: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  color: var(--text-light);
  transition: all 0.2s ease-in-out;
}

.category-sidebar li:hover {
  background-color: #fef4f4;
  color: var(--primary-color);
}

.category-sidebar li.active {
  background-color: var(--primary-color);
  color: white;
  font-weight: bold;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  align-content: start;
}

.menu-item-card {
  background-color: #fff;
  border-radius: 15px;
  box-shadow: var(--shadow-soft);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.menu-item-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow);
}

.menu-item-card img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.item-info {
  padding: 15px;
}

.item-info h3 {
  font-size: 16px;
  margin: 0 0 5px 0;
  color: var(--text-dark);
  font-weight: 600;
}

.item-info p {
    font-size: 13px;
    color: var(--text-light);
    margin: 0;
}

.item-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px 15px 15px;
  margin-top: auto;
}

.item-actions .price {
  font-size: 18px;
  font-weight: bold;
  color: var(--text-dark);
}

.cart-sidebar {
  width: 320px;
  display: flex;
  flex-direction: column;
}

.cart {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: var(--shadow-soft);
  padding: 25px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.cart h2 {
  font-size: 22px;
  color: var(--text-dark);
  margin: 0 0 20px 0;
  text-align: center;
  flex-shrink: 0;
}

.cart-body {
  flex-grow: 1;
  overflow-y: auto;
  margin: 0 -15px;
  padding: 0 15px;
}

.cart-empty {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--text-light);
}

.cart-items {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid var(--border-color);
}

.item-info-cart .item-name {
    font-weight: 600;
    font-size: 16px;
}

.item-info-cart .original-price {
    text-decoration: line-through;
    color: var(--text-light);
    font-size: 14px;
    margin-left: 10px;
}
.item-info-cart .discounted-price {
    color: var(--primary-color);
    font-weight: bold;
    font-size: 16px;
    margin-left: 8px;
}

.item-quantity-controls {
    display: flex;
    align-items: center;
    gap: 10px;
}

.item-quantity-controls button {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px solid var(--border-color);
    background-color: #fff;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.2s;
}

.item-quantity-controls button:hover { background-color: #f0f0f0; }

.cart-summary {
    border-top: 2px solid var(--border-color);
    padding-top: 20px;
    flex-shrink: 0;
}

.summary-item, .summary-total {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    margin-bottom: 12px;
}

.summary-total {
    font-size: 26px;
    font-weight: bold;
    color: var(--text-dark);
}

.promo-messages-container {
    margin: 15px 0;
}

.promo-message { padding: 10px; margin-bottom: 10px; border-radius: 5px; font-size: 14px; line-height: 1.5; }
.promo-message.discount { background-color: #e6fffa; border-left: 4px solid #38b2ac; color: #2c5282; }
.promo-message.gift { background-color: #fff5e6; border-left: 4px solid #f6ad55; color: #9c4221; }
.gift-achieved { color: #38a169; font-weight: bold; margin-left: 5px; }

.btn { padding: 10px 18px; border: none; border-radius: 8px; cursor: pointer; font-size: 15px; font-weight: bold; transition: all 0.3s ease; display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
.btn-primary { background-color: var(--primary-color); color: white; padding: 8px 16px; }
.btn-primary span { font-size: 18px; }
.btn-primary:hover { opacity: 0.9; transform: scale(1.05); }
.btn-outline { background-color: transparent; color: #ff6b6b; border: 1px solid #ffb997; }
.btn-outline:hover, .btn-outline.active { background-color: #ffb997; color: var(--text-dark); }
.btn-confirm { width: 100%; padding: 16px; font-size: 18px; justify-content: center; background-color: var(--secondary-color); color: var(--text-dark); }
.btn-confirm:hover { opacity: 0.9; }
.btn-confirm:disabled { background-color: #ccc; cursor: not-allowed; }

.checkout-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-content { background-color: #fff; padding: 40px; border-radius: 15px; box-shadow: var(--shadow); text-align: center; }
.modal-content h3 { margin-top: 0; font-size: 24px; }
.payment-options { display: flex; gap: 20px; margin: 25px 0; }
.btn-success { background-color: #48bb78; color: white; }
.btn-linepay { background-color: #00B900; color: white; }
.btn-secondary { background-color: #a0aec0; color: white; width: 100%; }
.gift-tag { color: #38a169; font-weight: bold; font-size: 12px; margin-left: 5px; }

.table-selection-wrapper { 
    padding-bottom: 15px; 
    margin-bottom: 15px; 
    text-align: center; 
    flex-shrink: 0;
    border-bottom: 1px solid var(--border-color);
}
.table-display { display: flex; justify-content: space-between; align-items: center; background-color: #f7f7f7; padding: 10px 15px; border-radius: 8px; }
.table-display span { font-size: 1rem; color: #333; }
.table-display button { font-size: 0.8rem; padding: 4px 8px; border-radius: 5px; background-color: #e0e0e0; cursor: pointer; border: none; }

</style>
