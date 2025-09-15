
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePromotionsStore = defineStore('promotions', () => {
  // State
  const discountPercentage = ref(15); // e.g., 15 for 15% off (85折)
  const giftThreshold = ref(500);
  const giftItemName = ref('炸物拼盤');

  // Actions
  function updatePromotions(newSettings) {
    if (newSettings.discountPercentage !== undefined) {
      discountPercentage.value = newSettings.discountPercentage;
    }
    if (newSettings.giftThreshold !== undefined) {
      giftThreshold.value = newSettings.giftThreshold;
    }
    if (newSettings.giftItemName !== undefined) {
      giftItemName.value = newSettings.giftItemName;
    }
  }

  return {
    discountPercentage,
    giftThreshold,
    giftItemName,
    updatePromotions,
  };
});
