<template>
  <!-- 
    核心改動 1: 卡片結構保持不變，但樣式的改變會賦予它新生
  -->
  <div class="menu-item-card">
    <div class="image-container">
      <img :src="item.image" :alt="item.name" />
    </div>
    <div class="item-info">
      <h3>{{ item.name }}</h3>
      <p>{{ item.category }}</p>
    </div>
    <div class="item-actions">
      <span class="price">NT${{ item.price }}</span>
      <button class="btn btn-primary" @click="$emit('addToCart', item)"><span>&#8853;</span> 加入</button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ item: any }>();
const emit = defineEmits(['addToCart']);
</script>

<style scoped>
/* 
  核心改動 2: 全新的卡片樣式，注入 "Bold Definition"
*/
.menu-item-card {
  background-color: #ffffff;
  border-radius: 20px; /* 更大的圓角，看起來更柔和、更現代 */
  /* 
    陰影的革命: 
    - 使用多層次、更柔和的 box-shadow 來創造深度
    - 參考了現代 UI 設計趨勢，例如 a shadow from https://getcssscan.com/css-box-shadow-examples
  */
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  /* 
    光影的互動:
    - 過渡效果應用到 transform 和 box-shadow，讓動畫更流暢
    - 增加了 opacity 過渡，讓光暈效果更自然
  */
  transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
}

/* 
  光影的互動 2: 
  - transform: translateY(-10px) 讓卡片上浮更明顯
  - box-shadow 變得更深、更擴散，並帶有主題色的光暈 (hsla(195, 53%, 79%, 0.4))
*/
.menu-item-card:hover {
  transform: translateY(-10px);
  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, 
              rgba(0, 0, 0, 0.05) 0px 4px 6px -2px, 
              hsla(195, 53%, 79%, 0.4) 0px 0px 0px 4px; /* 主題色光暈 */
}

/* 核心改動 3: 圖片的魅力 */
.image-container {
  width: 100%;
  height: 160px; /* 增加圖片高度，更具視覺衝擊力 */
  overflow: hidden; /* 確保圖片圓角生效 */
}

.menu-item-card img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 確保圖片填滿容器且不變形 */
  transition: transform 0.3s ease;
}

.menu-item-card:hover img {
  transform: scale(1.05); /* 滑鼠懸停時，圖片輕微放大 */
}

/* 核心改動 4: 版面的呼吸感 */
.item-info {
  padding: 20px; /* 增加內邊距，讓文字有更多呼吸空間 */
  text-align: center; /* 文字居中，看起來更整潔 */
}

.item-info h3 {
  font-size: 18px; /* 加大字體 */
  margin: 0 0 8px 0;
  color: var(--text-dark);
  font-weight: 700; /* 更粗的字重 */
}

.item-info p {
  font-size: 14px;
  color: var(--text-light);
  margin: 0;
}

.item-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px 20px 20px; /* 統一內邊距 */
  margin-top: auto; /* 將這個區塊推到卡片底部 */
}

.item-actions .price {
  font-size: 20px;
  font-weight: bold;
  color: var(--primary-color);
}

.btn {
    border: none;
    border-radius: 10px; /* 更大的圓角 */
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

/* 核心改動 5: 按鈕的質感 */
.btn-primary {
  background: linear-gradient(45deg, #ff6b6b, #ff8e8e); /* 使用漸層背景 */
  color: white;
  padding: 12px 22px;
  font-size: 16px;
  box-shadow: rgba(255, 107, 107, 0.3) 0px 4px 12px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: rgba(255, 107, 107, 0.5) 0px 6px 20px; /* 懸停時，陰影更明顯 */
  opacity: 1;
}

.btn-primary span {
  font-size: 20px;
}
</style>