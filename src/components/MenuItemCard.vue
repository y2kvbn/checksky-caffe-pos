<template>
  <div class="menu-item-card">
    <img :src="item.image" :alt="item.name" />
    <div class="item-info">
      <h3>{{ item.name }}</h3>
      <p>{{ item.category }}</p>
    </div>
    <div class="item-actions">
      <span class="price">NT${{ item.price }}</span>
      <button class="btn btn-primary" @click="emit('addToCart', item)"><span>&#8853;</span> 加入</button>
    </div>
  </div>
</template>

<script setup lang="ts">

defineProps<{ item: any }>();
const emit = defineEmits(['addToCart']);

</script>

<style scoped>
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

.btn {
    padding: 10px 18px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 15px;
    font-weight: bold;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}
</style>
