<template>
  <aside class="cart-sidebar">
    <div class="cart">
      <h2>我的購物車</h2>
      <div class="cart-body">
        <div v-if="cartItems.length === 0" class="cart-empty">
          <p>購物車是空的</p>
        </div>
        <!-- [REFACTORED] Cart items rendering with hierarchy -->
        <div v-else class="cart-items">
          <div v-for="item in cartItems" :key="item.cartItemId" class="cart-item-wrapper">
            <!-- Main Item -->
            <div class="cart-item">
              <div class="item-info-cart">
                <span class="item-name">{{ item.name }}</span>
                <span class="item-price">NT${{ item.price }}</span>
              </div>
              <div class="item-quantity-controls">
                <button @click="$emit('decreaseQuantity', item)">-</button>
                <span>{{ item.quantity }}</span>
                <button @click="$emit('increaseQuantity', item)">+</button>
              </div>
            </div>

            <!-- Sub Items (for set meals) -->
            <div v-if="item.subItems && item.subItems.length > 0" class="sub-items-list">
              <div v-for="(subItem, index) in item.subItems" :key="index" class="sub-item">
                <span class="sub-item-name">└ {{ subItem.name }}</span>
                <span class="sub-item-price">
                  <template v-if="subItem.price > 0">
                    NT${{ subItem.price }} x {{ subItem.quantity }}
                  </template>
                  <template v-else>
                    (附贈)
                  </template>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="cart-summary">
        
        <div v-if="promotionHints.length > 0" class="promo-hints-container">
            <div v-for="hint in promotionHints" :key="hint" class="promo-message hint">
                <p>💡 {{ hint }}</p>
            </div>
        </div>

        <div class="summary-item">
          <span>小計:</span>
          <span>NT${{ subtotal }}</span>
        </div>

        <div v-if="appliedDeals.length > 0" class="promo-messages-container">
            <div v-for="deal in appliedDeals" :key="deal" class="promo-message discount">
                <p>🎉 已套用: {{ deal }}</p>
            </div>
        </div>
        
        <div v-if="gifts.length > 0" class="promo-messages-container">
            <div v-for="gift in gifts" :key="gift" class="promo-message gift">
                <p>🎁 恭喜獲得: {{ gift }}</p>
            </div>
        </div>

        <div class="summary-total">
          <span>總計:</span>
          <span>NT${{ total }}</span>
        </div>

        <div class="checkout-actions">
          <button class="btn btn-confirm" @click="$emit('checkout')" :disabled="!selectedTable || cartItems.length === 0">
            前往結帳
          </button>

          <button 
            v-if="!selectedTable && cartItems.length > 0" 
            class="btn btn-select-table-overlay" 
            @click="$emit('openTableModal')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>請先選擇桌號</span>
          </button>
        </div>

      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { OrderItem } from '../stores/orders';

// Define a more specific type for cart items for clarity
interface CartItemForDisplay extends OrderItem {
  cartItemId: string;
  subItems?: OrderItem[];
}

defineProps<{
  cartItems: CartItemForDisplay[],
  subtotal: number,
  total: number,
  appliedDeals: string[],
  gifts: string[],
  promotionHints: string[],
  selectedTable: any,
}>();

defineEmits(['decreaseQuantity', 'increaseQuantity', 'checkout', 'openTableModal']);
</script>

<style scoped>
.cart-sidebar {
  width: 350px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.cart {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: var(--shadow-soft);
  padding: 25px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
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

/* [NEW] Wrapper for each item/set meal */
.cart-item-wrapper {
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-info-cart .item-name {
  font-weight: 600;
  font-size: 16px;
}

.item-info-cart .item-price {
    margin-left: 10px;
    font-size: 16px;
    font-weight: 500;
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

/* [NEW] Styles for sub-items */
.sub-items-list {
  padding-left: 15px;
  margin-top: 8px;
}

.sub-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #555;
  padding: 2px 0;
}

.sub-item-price {
  font-size: 13px;
  color: #777;
}

/* --- Cart Summary --- */
.cart-summary {
  border-top: 2px solid var(--border-color);
  padding-top: 20px;
  flex-shrink: 0;
}

.summary-item,
.summary-total {
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

.promo-messages-container, .promo-hints-container {
  margin: 15px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.promo-message {
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
  font-weight: 500;
}

.promo-message.hint {
  background-color: #e6f7ff;
  border-left: 4px solid #1890ff;
  color: #0050b3;
}

.promo-message.hint p {
  margin: 0;
}

.promo-message.discount {
  background-color: #e6fffa;
  border-left: 4px solid #38b2ac;
  color: #2c5282;
}

.promo-message.gift {
  background-color: #fff5e6;
  border-left: 4px solid #f6ad55;
  color: #9c4221;
}

/* --- Action Buttons Container --- */
.checkout-actions {
  position: relative;
  margin-top: 20px;
}

/* --- Overlay Button --- */
.btn-select-table-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: rgba(255, 106, 61, 0.95); /* Semi-transparent but strong */
  color: #FFFFFF;
  border: 2px dashed #FFFFFF;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(2px);
}

.btn-select-table-overlay:hover {
  background-color: rgba(255, 106, 61, 1);
}

.btn-select-table-overlay svg {
  margin-bottom: 8px;
}

/* --- Checkout Button --- */
.btn-confirm {
  width: 100%;
  padding: 16px;
  font-size: 18px;
  font-weight: bold;
  justify-content: center;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #FF6A3D;
  color: #FFFFFF;
  box-shadow: 0 4px 15px rgba(255, 106, 61, 0.4);
}

.btn-confirm:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(255, 106, 61, 0.6);
}

.btn-confirm:active:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(255, 106, 61, 0.4);
}

.btn-confirm:disabled {
  background-color: #E5E7EB;
  color: #9CA3AF;
  box-shadow: none;
  cursor: not-allowed;
}
</style>
