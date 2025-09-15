<template>
  <div class="pos-container">
    <header class="pos-header">
      <button class="btn btn-outline" @click="$emit('setView', 'dashboard')"><span>&#128187;</span> 返回儀表板</button>
      <h1 class="logo">向天泓咖啡廳</h1>
      <div>
        <button class="btn btn-outline"><span>&#128197;</span> 訂位總覽</button>
        <button class="btn btn-outline"><span>&#8962;</span> 回到首頁</button>
      </div>
    </header>
    <div class="pos-main">
      <aside class="category-sidebar">
        <h2>分類</h2>
        <ul>
          <li v-for="category in categories" :key="category.id" :class="{ active: category.id === activeCategory }" @click="activeCategory = category.id">
            {{ category.name }}
          </li>
        </ul>
      </aside>
      <main class="menu-grid">
        <div class="menu-item-card" v-for="item in filteredMenu" :key="item.id">
          <img :src="item.image" :alt="item.name" />
          <div class="item-details">
            <h3>{{ item.name }}</h3>
            <p>{{ item.categoryName }}</p>
            <div class="item-actions">
              <span class="price">NT${{ item.price }}</span>
              <button class="btn btn-primary" @click="addToCart(item)"><span>&#10010;</span> 加入</button>
            </div>
          </div>
        </div>
      </main>
      <aside class="cart-sidebar">
        <div class="cart">
          <h2>我的購物車</h2>
          <div v-if="cart.length === 0" class="cart-empty">
            <p>購物車是空的</p>
          </div>
          <div v-else class="cart-items">
            <div class="cart-item" v-for="item in cart" :key="item.id">
                <div class="item-info">
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
            <div class="promo-message">
              <p>&#127881; 全品項85折優惠實施中！</p>
              <p>滿500元再送炸物拼盤一份！</p>
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useOrdersStore } from '../stores/orders';

const emit = defineEmits(['setView']);
const ordersStore = useOrdersStore();

const activeCategory = ref('hotpot');
const cart = ref([]);
const showCheckoutModal = ref(false);

const categories = ref([
    { id: 'hotpot', name: '特色風味小火鍋' },
    { id: 'meal', name: '特色風味簡餐' },
    { id: 'coffee', name: '單品咖啡' },
    { id: 'espresso', name: '義式咖啡' },
    { id: 'tea', name: '茶' },
    { id: 'decaf', name: '無咖啡因飲品' },
    { id: 'dessert', name: '甜點' },
    { id: 'fried', name: '炸物' },
]);

const menuItems = ref([
    { id: 1, name: '蒜茄牛奶鍋 (雞肉)', category: 'hotpot', categoryName: '特色風味小火鍋', price: 400, image: 'https://plus.unsplash.com/premium_photo-1664472637341-3c46d05f33e5?q=80&w=400&auto=format&fit=crop' },
    { id: 2, name: '泰式酸辣鍋 (雞肉)', category: 'hotpot', categoryName: '特色風味小火鍋', price: 380, image: 'https://plus.unsplash.com/premium_photo-1664472637341-3c46d05f33e5?q=80&w=400&auto=format&fit=crop' },
    { id: 3, name: '賽夏馬告鍋 (雞肉)', category: 'hotpot', categoryName: '特色風味小火鍋', price: 380, image: 'https://images.unsplash.com/photo-1594232329389-9acef6f96b2e?q=80&w=400&auto=format&fit=crop' },
    { id: 4, name: '賽夏馬告鍋 (素)', category: 'hotpot', categoryName: '特色風味小火鍋', price: 320, image: 'https://images.unsplash.com/photo-1594232329389-9acef6f96b2e?q=80&w=400&auto=format&fit=crop' },
    { id: 5, name: '羊奶樹根鍋 (雞肉)', category: 'hotpot', categoryName: '特色風味小火鍋', price: 420, image: 'https://plus.unsplash.com/premium_photo-1675284379988-34824b453479?q=80&w=400&auto=format&fit=crop' },
    { id: 6, name: '羊奶樹根鍋 (素)', category: 'hotpot', categoryName: '特色風味小火鍋', price: 360, image: 'https://plus.unsplash.com/premium_photo-1675284379988-34824b453479?q=80&w=400&auto=format&fit=crop' },
    { id: 7, name: '十全養生鍋 (雞肉)', category: 'hotpot', categoryName: '特色風味小火鍋', price: 400, image: 'https://images.unsplash.com/photo-1512132411229-c30391241dd8?q=80&w=400&auto=format&fit=crop' },
    { id: 8, name: '十全養生鍋 (素)', category: 'hotpot', categoryName: '特色風味小火鍋', price: 340, image: 'https://images.unsplash.com/photo-1512132411229-c30391241dd8?q=80&w=400&auto=format&fit=crop' },
]);

const filteredMenu = computed(() => {
  return menuItems.value.filter(item => item.category === activeCategory.value);
});

const addToCart = (item) => {
  const existingItem = cart.value.find(cartItem => cartItem.id === item.id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.value.push({ ...item, quantity: 1 });
  }
};

const increaseQuantity = (item) => {
    item.quantity++;
};

const decreaseQuantity = (item) => {
    item.quantity--;
    if (item.quantity === 0) {
        cart.value = cart.value.filter(cartItem => cartItem.id !== item.id);
    }
};

const subtotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const total = computed(() => {
  let finalTotal = subtotal.value * 0.85;
  if (subtotal.value >= 500) {
    // Here you would add logic for the free platter, for now we just calculate the price
  }
  return Math.round(finalTotal);
});

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
  };

  ordersStore.addOrder(newOrder);

  // Reset cart and close modal
  cart.value = [];
  showCheckoutModal.value = false;

  // Switch back to the dashboard
  emit('setView', 'dashboard');
};

</script>

<style scoped>
/* Existing styles remain the same */

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
  grid-template-columns: 220px 1fr 320px;
  flex-grow: 1;
  overflow: hidden;
  gap: 20px;
  padding: 20px;
}

.category-sidebar {
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: var(--shadow-soft);
}

.category-sidebar h2 {
  font-size: 20px;
  color: var(--text-dark);
  margin-top: 0;
  margin-bottom: 20px;
}

.category-sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-sidebar li {
  padding: 12px 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  color: var(--text-light);
  transition: all 0.2s ease-in-out;
}

.category-sidebar li:hover {
  background-color: #f0f0f0;
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
  overflow-y: auto;
  padding: 5px;
}

.menu-item-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: var(--shadow-soft);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.menu-item-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.item-details {
  padding: 15px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.item-details h3 {
  font-size: 16px;
  margin: 0 0 5px 0;
  color: var(--text-dark);
}

.item-details p {
    font-size: 12px;
    color: var(--text-light);
    margin: 0 0 10px 0;
}

.item-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.item-actions .price {
  font-size: 18px;
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
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.cart h2 {
  font-size: 20px;
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
}

.cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid var(--border-color);
}

.item-info .item-name {
    font-weight: 500;
}

.item-info .item-price {
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
    width: 25px;
    height: 25px;
    border-radius: 50%;
    border: 1px solid var(--border-color);
    background-color: #fff;
    cursor: pointer;
}

.cart-summary {
    margin-top: auto;
    border-top: 1px solid var(--border-color);
    padding-top: 15px;
}

.summary-item, .summary-total {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    margin-bottom: 10px;
}

.summary-total {
    font-size: 24px;
    font-weight: bold;
    color: var(--text-dark);
}

.promo-message {
    background-color: #e6fffa;
    border-left: 3px solid #38b2ac;
    padding: 10px;
    margin: 15px 0;
    color: #2c5282;
    font-size: 14px;
}

.promo-message p {
    margin: 5px 0;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
    opacity: 0.9;
}

.btn-outline {
    background-color: transparent;
    color: var(--secondary-color);
    border: 1px solid var(--secondary-color);
}

.btn-outline:hover {
    background-color: var(--secondary-color);
    color: var(--text-dark);
}

.btn-confirm {
  width: 100%;
  padding: 15px;
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
    background-color: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
}

.modal-content {
    background-color: #fff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: var(--shadow);
    text-align: center;
}

.modal-content h3 {
    margin-top: 0;
    font-size: 22px;
}

.payment-options {
    display: flex;
    gap: 15px;
    margin: 20px 0;
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
