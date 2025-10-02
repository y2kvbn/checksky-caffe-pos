<template>
  <div class="main-header">
    <h2>即時訂單總覽</h2>
  </div>
</template>

<script setup lang="ts">
// No emits needed now
</script>

<style scoped>
/* [FIX-7] 縮減底部間距 */
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px; /* 縮減間距 */
}

.main-header h2 {
  font-size: 28px;
  color: #333;
  font-weight: bold;
  margin: 0;
}
</style>
