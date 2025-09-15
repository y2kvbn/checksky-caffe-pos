
<template>
  <div class="pos-container">
    <!-- Header -->
    <header class="pos-header">
      <button class="btn btn-outline" @click="$emit('setView', 'dashboard')"><span>&#128187;</span> 返回儀表板</button>
      <h1 class="logo">向天泓咖啡廳</h1>
      <div>
        <button class="btn btn-outline"><span>&#128197;</span> 訂位總覽</button>
        <button class="btn btn-outline"><span>&#8962;</span> 回到首頁</button>
      </div>
    </header>
    
    <div class="pos-main">
      <!-- Category Sidebar -->
      <aside class="category-sidebar">
        <h2>分類</h2>
        <ul>
          <li 
            v-for="category in categories.filter(c => c !== '全部')" 
            :key="category" 
            :class="{ active: category === activeCategory }" 
            @click="activeCategory = category"
          >
            {{ category }}
          </li>
        </ul>
      </aside>
      
      <!-- Menu Grid -->
      <main class="menu-grid">
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
      </main>

      <!-- Cart Sidebar -->
      <aside class="cart-sidebar">
        <div class="cart">
          <h2>我的購物車</h2>
          <div v-if="cart.length === 0" class="cart-empty">
            <p>購物車是空的</p>
          </div>
          <div v-else class="cart-items">
            <div class="cart-item" v-for="item in cart" :key="item.cartItemId">
                <div class="item-info-cart">
                    <span class="item-name">{{ item.name }}</span>
                    <span class="item-price">NT${{ item.price }}</span>
                </div>
                <div class="item-quantity-controls">
                    <button @click="decreaseQuantity(item)">-</button>
                    <span>{{ item.quantity }}</span>
                    <button @click="increaseQuantity(item)">+</button>
                </div>
            </div>
          </div>
          <div class="cart-summary">
            <div class="summary-item">
              <span>小計:</span>
              <span>NT${{ subtotal }}</span>
            </div>
            <div v-if="promotionsEnabled" class="promo-message">
              <p>&#127881; {{ discountMessage }}</p>
              <p>{{ giftMessage }} <span v-if="isGiftThresholdMet" class="gift-achieved">(已達成)</span></p>
            </div>
            <div class="summary-total">
              <span>總計:</span>
              <span>NT${{ total }}</span>
            </div>
            <button class="btn btn-confirm" @click="checkout">前往結帳</button>
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
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useOrdersStore } from '../stores/orders';
import { useMenuStore } from '../stores/menu';
import { usePromotionsStore } from '../stores/promotions';
import SetMealModal from './SetMealModal.vue'; // Import the new modal

// --- Emits & Stores ---
const emit = defineEmits(['setView']);
const ordersStore = useOrdersStore();
const menuStore = useMenuStore();
const promotionsStore = usePromotionsStore();

// --- Store State & Getters ---
const { items: menuItems, categories } = storeToRefs(menuStore);
const { discountPercentage, giftThreshold, giftItemName } = storeToRefs(promotionsStore);

// --- Component State ---
const activeCategory = ref('特色風味小火鍋'); 
const cart = ref([]);
const showCheckoutModal = ref(false);
const isSetMealModalVisible = ref(false);
const selectedSetMeal = ref(null);
let cartIdCounter = 0; // To generate unique IDs for cart items

// --- Computed Properties ---
const filteredMenu = computed(() => {
  if (activeCategory.value === '全部') {
    return menuItems.value.filter(item => item.inStock);
  } 
  return menuItems.value.filter(item => item.category === activeCategory.value && item.inStock);
});

watch(categories, (newCategories) => {
  if (newCategories && newCategories.length > 1 && !newCategories.includes(activeCategory.value)) {
      activeCategory.value = newCategories[1]; // Set to the first real category
  }
}, { immediate: true });

const subtotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

// --- Dynamic Promotions ---
const promotionsEnabled = computed(() => discountPercentage.value > 0 || giftThreshold.value > 0);

const discountMessage = computed(() => {
    if (discountPercentage.value > 0) {
        return `全品項${100 - discountPercentage.value}折優惠實施中！`;
    }
    return '暫無折扣活動';
});

const isGiftThresholdMet = computed(() => {
    return giftThreshold.value > 0 && subtotal.value >= giftThreshold.value;
});

const giftMessage = computed(() => {
    if (giftThreshold.value > 0 && giftItemName.value) {
        return `滿${giftThreshold.value}元再送${giftItemName.value}一份！`;
    }
    return '暫無滿額贈活動';
});


const total = computed(() => {
  const discount = 1 - (discountPercentage.value / 100);
  const finalTotal = subtotal.value * discount;
  return Math.round(finalTotal);
});

// --- Cart Methods ---
const addToCart = (item) => {
  // If the item is a set meal, open the configuration modal
  if (item.isSetMeal) {
    selectedSetMeal.value = item;
    isSetMealModalVisible.value = true;
  } else {
    // Standard item handling
    const existingItem = cart.value.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.value.push({ ...item, quantity: 1, cartItemId: `cart-item-${cartIdCounter++}` });
    }
  }
};

const handleSetMealConfirm = (mealPackage) => {
  // Add each item from the configured meal package to the cart
  mealPackage.forEach(item => {
    // Give each item a unique cart ID to treat them as separate entries
    cart.value.push({ ...item, quantity: 1, cartItemId: `cart-item-${cartIdCounter++}` });
  });
  isSetMealModalVisible.value = false;
};

const increaseQuantity = (item) => {
    item.quantity++;
};

const decreaseQuantity = (item) => {
    item.quantity--;
    if (item.quantity === 0) {
        // Use the unique cartItemId to remove the correct item
        cart.value = cart.value.filter(cartItem => cartItem.cartItemId !== item.cartItemId);
    }
};

// --- Checkout Methods ---
const checkout = () => {
    if (cart.value.length > 0) {
        showCheckoutModal.value = true;
    }
};

const processOrder = (paymentMethod) => {
  const newOrder = {
    items: JSON.parse(JSON.stringify(cart.value)),
    subtotal: subtotal.value,
    total: total.value,
    paymentMethod: paymentMethod,
    appliedPromotion: {
        discount: `${discountPercentage.value}% OFF`,
        gift: isGiftThresholdMet.value ? `送 ${giftItemName.value}` : '無' 
    }
  };

  ordersStore.addOrder(newOrder);
  cart.value = [];
  showCheckoutModal.value = false;
  emit('setView', 'dashboard');
};

</script>

<style scoped>
:root {
    --primary-color: #ff6b6b; 
    --secondary-color: #ffb997;
    --tertiary-color: #fff;
    --text-dark: #333;
    --text-light: #777;
    --border-color: #eee;
    --shadow-soft: 0 4px 12px rgba(0,0,0,0.05);
    --shadow: 0 8px 24px rgba(0,0,0,0.1);
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

.pos-main {
  display: grid;
  grid-template-columns: 240px 1fr 300px; /* Cart width reduced */
  flex-grow: 1;
  overflow: hidden;
  gap: 25px;
  padding: 25px;
}

.category-sidebar {
  background-color: #fff;
  padding: 25px;
  border-radius: 12px;
  box-shadow: var(--shadow-soft);
  overflow-y: auto;
}

.category-sidebar h2 {
  font-size: 22px;
  color: var(--text-dark);
  margin-top: 0;
  margin-bottom: 25px;
}

.category-sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
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
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  overflow-y: auto;
  padding: 5px;
  align-content: start; /* Prevent stretching */
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
  height: 120px; /* Image height reduced */
  object-fit: cover;
}

.item-info {
  padding: 15px;
}

.item-info h3 {
  font-size: 16px; /* Slightly reduced font size */
  margin: 0 0 5px 0;
  color: var(--text-dark);
  font-weight: 600;
}

.item-info p {
    font-size: 13px; /* Slightly reduced font size */
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
  font-size: 18px; /* Slightly reduced font size */
  font-weight: bold;
  color: var(--text-dark);
}

.cart-sidebar {
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
}

.cart h2 {
  font-size: 22px;
  color: var(--text-dark);
  margin: 0 0 20px 0;
  text-align: center;
}

.cart-empty {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--text-light);
}
.cart-items {
    flex-grow: 1;
    overflow-y: auto;
    padding-right: 10px;
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

.item-info-cart .item-price {
    color: var(--text-light);
    font-size: 14px;
    margin-left: 10px;
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

.item-quantity-controls button:hover {
    background-color: #f0f0f0;
}

.cart-summary {
    margin-top: auto;
    border-top: 2px solid var(--border-color);
    padding-top: 20px;
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

.promo-message {
    background-color: #e6fffa;
    border-left: 4px solid #38b2ac;
    padding: 12px;
    margin: 20px 0;
    color: #2c5282;
    font-size: 14px;
    line-height: 1.6;
}

.promo-message p {
    margin: 5px 0;
}

.gift-achieved {
    color: #38a169;
    font-weight: bold;
    margin-left: 5px;
}

.btn {
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: bold;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
  padding: 8px 16px;
}

.btn-primary span {
    font-size: 18px;
}

.btn-primary:hover {
    opacity: 0.9;
    transform: scale(1.05);
}

.btn-outline {
    background-color: transparent;
    color: #ff6b6b;
    border: 1px solid #ffb997;
}

.btn-outline:hover {
    background-color: #ffb997;
    color: var(--text-dark);
}

.btn-confirm {
  width: 100%;
  padding: 16px;
  font-size: 18px;
  justify-content: center;
  background-color: var(--secondary-color);
  color: var(--text-dark);
}

.btn-confirm:hover {
    opacity: 0.9;
}

.checkout-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
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
