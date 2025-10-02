<template>
  <div class="menu-item-card" @click="$emit('addToCart', item)">
    <div class="image-container">
      <img :src="item.image" :alt="item.name" />
    </div>
    <div class="item-info">
      <h3>{{ item.name }}</h3>
      <p>{{ item.category }}</p>
    </div>
    <div class="item-price">
      <template v-if="specialOffer">
        <span class="original-price">NT${{ item.price }}</span>
        <span class="discount-price">NT${{ specialOffer.discountPrice }}</span>
      </template>
      <template v-else>
        <span class="price">NT${{ item.price }}</span>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { usePromotionsStore, type SingleItemDeal } from '../stores/promotions';
import type { MenuItem } from '../stores/menu';

const props = defineProps<{ item: MenuItem }>();
const emit = defineEmits(['addToCart']);

const promotionsStore = usePromotionsStore();
const { activePromotions } = storeToRefs(promotionsStore);

const specialOffer = computed(() => {
  const deal = activePromotions.value.find(
    (p) => p.type === 'SINGLE_ITEM_DEAL' && (p as SingleItemDeal).itemId === props.item.id
  ) as SingleItemDeal | undefined;
  return deal;
});
</script>

<style scoped>
.menu-item-card {
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
  cursor: pointer; /* <--- 重要：滑鼠指標變為手形 */
}

.menu-item-card:hover {
  transform: translateY(-10px);
  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, 
              rgba(0, 0, 0, 0.05) 0px 4px 6px -2px, 
              hsla(195, 53%, 79%, 0.4) 0px 0px 0px 4px;
}

.image-container {
  width: 100%;
  height: 160px;
  overflow: hidden;
}

.menu-item-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.menu-item-card:hover img {
  transform: scale(1.05);
}

.item-info {
  padding: 20px 20px 0 20px; /* 調整底部 padding */
  text-align: center;
  flex-grow: 1; /* <--- 讓 info 區塊佔據多餘空間 */
}

.item-info h3 {
  font-size: 18px;
  margin: 0 0 8px 0;
  color: var(--text-dark);
  font-weight: 700;
}

.item-info p {
  font-size: 14px;
  color: var(--text-light);
  margin: 0;
}

.item-price {
  padding: 15px 20px 20px 20px; /* 價格的 padding */
  text-align: center;
  font-weight: bold;
}

.price, .discount-price {
  font-size: 22px;
  color: var(--primary-color);
}

.original-price {
  font-size: 16px;
  color: #a0aec0; /* 淺灰色 */
  text-decoration: line-through; /* <--- 核心：刪除線 */
  margin-right: 10px;
}

.discount-price {
  color: #e53e3e; /* <--- 醒目的紅色 */
}

</style>
