<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <h1>404</h1>
      <h2>找不到頁面</h2>
      <p>抱歉，您要找的頁面不存在。</p>
      <router-link to="/dashboard/home" class="back-home-link">返回首頁</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// 這個元件不需要任何特定的 script 邏輯
</script>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f9fa;
  font-family: 'Arial', sans-serif;
  text-align: center;
}

.not-found-content {
  padding: 40px;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.not-found-content h1 {
  font-size: 120px;
  color: #dc3545;
  margin: 0;
}

.not-found-content h2 {
  font-size: 36px;
  color: #343a40;
  margin: 10px 0;
}

.not-found-content p {
  font-size: 18px;
  color: #6c757d;
  margin-bottom: 30px;
}

.back-home-link {
  display: inline-block;
  padding: 12px 24px;
  font-size: 18px;
  color: white;
  background-color: #007bff;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.back-home-link:hover {
  background-color: #0056b3;
}
</style>
