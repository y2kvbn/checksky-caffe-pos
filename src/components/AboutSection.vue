<template>
  <div class="settings-card">
    <h3><i class="fas fa-info-circle"></i> 關於</h3>
    <div class="about-section">
      <div class="about-item">
        <strong>程式版本:</strong>
        <span>1.0.0</span>
      </div>
      <div class="about-item">
        <strong>客服聯繫方式:</strong>
        <span>永泓股份有限公司 (service@checksky.com.tw)</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.settings-card {
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  padding: 25px;
  margin-bottom: 25px;
}

.settings-card h3 {
  font-size: 20px;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #333;
}

.about-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.about-item {
  display: flex;
  gap: 10px;
}

.about-item strong {
  color: #333;
}
</style>
