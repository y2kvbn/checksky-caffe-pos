
import { defineStore } from 'pinia';
import { reactive } from 'vue';

const STORAGE_KEY = '向天泓咖啡廳_優惠設定';

export const usePromotionsStore = defineStore('promotions', () => {
  // --- STATE ---
  // Helper function to create a reactive object with default values
  const createReactiveState = (defaults) => reactive({ ...defaults });
  
  // Default states
  const defaultSingleItemDeal = {
    enabled: false,
    itemId: '',
    itemName: '特定品項',
    discountPrice: 100,
    originalPrice: 120,
  };
  const defaultSpendAndGet = {
    enabled: false,
    threshold: 500,
    giftName: '炸物拼盤',
  };
  const defaultSpendAndDiscount = {
    enabled: false,
    threshold: 1000,
    discount: 85, 
  };

  const singleItemDeal = createReactiveState(defaultSingleItemDeal);
  const spendAndGet = createReactiveState(defaultSpendAndGet);
  const spendAndDiscount = createReactiveState(defaultSpendAndDiscount);

  // --- ACTIONS ---

  // Saves the current state to localStorage
  function saveState() {
    try {
      const stateToSave = {
        singleItemDeal: singleItemDeal,
        spendAndGet: spendAndGet,
        spendAndDiscount: spendAndDiscount,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.error("無法儲存優惠設定:", error);
    }
  }

  // Loads the state from localStorage
  function loadState() {
    try {
      const savedStateJSON = localStorage.getItem(STORAGE_KEY);
      if (savedStateJSON) {
        const savedState = JSON.parse(savedStateJSON);
        updateSingleItemDeal(savedState.singleItemDeal || defaultSingleItemDeal, false);
        updateSpendAndGet(savedState.spendAndGet || defaultSpendAndGet, false);
        updateSpendAndDiscount(savedState.spendAndDiscount || defaultSpendAndDiscount, false);
      }
    } catch (error) {
      console.error("無法讀取優惠設定:", error);
    }
  }

  // Update actions now call saveState
  function updateSingleItemDeal(settings, shouldSave = true) {
    Object.assign(singleItemDeal, settings);
    if (shouldSave) saveState();
  }

  function updateSpendAndGet(settings, shouldSave = true) {
    Object.assign(spendAndGet, settings);
    if (shouldSave) saveState();
  }

  function updateSpendAndDiscount(settings, shouldSave = true) {
    Object.assign(spendAndDiscount, settings);
    if (shouldSave) saveState();
  }

  // --- INITIALIZATION ---
  // Load the state as soon as the store is initialized
  loadState();

  return {
    singleItemDeal,
    spendAndGet,
    spendAndDiscount,
    updateSingleItemDeal,
    updateSpendAndGet,
    updateSpendAndDiscount,
  };
});
