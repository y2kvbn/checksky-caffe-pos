<template>
  <div class="system-settings">
    <h2>系統設定</h2>
    <ReceiptNotesSettings />
    <LoginManagement />
    <AboutSection />
  </div>
</template>

<script setup lang="ts">
import ReceiptNotesSettings from './ReceiptNotesSettings.vue';
import LoginManagement from './LoginManagement.vue';
import AboutSection from './AboutSection.vue';
</script>

<style scoped>
.system-settings h2 {
  font-size: 28px;
  margin-bottom: 25px;
  color: #333;
}
</style>
