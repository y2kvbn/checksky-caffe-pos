
import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const usePromotionsStore = defineStore('promotions', () => {
  // --- STATE ---

  // 1. Single Item Discount (單項優惠價)
  const singleItemDeal = reactive({
    enabled: false,
    itemId: '', // ID of the item to be discounted, will be set from menu store
    itemName: '特定品項',
    discountPrice: 100,
    originalPrice: 120,
  });

  // 2. Spend & Get (滿額贈送)
  const spendAndGet = reactive({
    enabled: false,
    threshold: 500,
    giftName: '炸物拼盤',
  });

  // 3. Spend & Discount (滿額打折)
  const spendAndDiscount = reactive({
    enabled: false,
    threshold: 1000,
    discount: 85, // e.g. 85 for 85折 (15% off)
  });

  // --- ACTIONS ---

  function updateSingleItemDeal(settings) {
    Object.assign(singleItemDeal, settings);
  }

  function updateSpendAndGet(settings) {
    Object.assign(spendAndGet, settings);
  }

  function updateSpendAndDiscount(settings) {
    Object.assign(spendAndDiscount, settings);
  }

  return {
    singleItemDeal,
    spendAndGet,
    spendAndDiscount,
    updateSingleItemDeal,
    updateSpendAndGet,
    updateSpendAndDiscount,
  };
});
