import { defineStore } from 'pinia';
import { ref, watch, computed } from 'vue';

const STORAGE_KEY = '向天泓咖啡廳_優惠設定';

// 1. 為各種優惠活動定義 TypeScript 介面

// 從 promotions.js 移植過來
export interface SingleItemDeal {
  enabled: boolean;
  itemId: string;
  itemName: string;
  discountPrice: number;
  originalPrice: number;
}

export interface SpendAndGet {
  enabled: boolean;
  threshold: number;
  giftName: string;
}

export interface SpendAndDiscount {
  enabled: boolean;
  threshold: number;
  discount: number; // 例如 85 代表 85 折
}

// 2. 為整個 store 的 state 定義介面，加入 singleItemDeal
interface PromotionsState {
  singleItemDeal: SingleItemDeal;
  spendAndGet: SpendAndGet;
  spendAndDiscount: SpendAndDiscount;
}

// 3. 預設狀態，加入 singleItemDeal 的預設值
const defaultState: PromotionsState = {
  singleItemDeal: {
    enabled: true,
    itemId: 'hpt01',
    itemName: '蕃茄牛奶鍋 (雞肉)',
    discountPrice: 350,
    originalPrice: 400,
  },
  spendAndGet: {
    enabled: true,
    threshold: 600,
    giftName: '主廚精選甜點一份',
  },
  spendAndDiscount: {
    enabled: true,
    threshold: 1200,
    discount: 88, // 88 折
  },
};

export const usePromotionsStore = defineStore('promotions', () => {
  // 4. 單一的 ref 管理 state，並從 localStorage 初始化
  const state = ref<PromotionsState>(loadState());

  function loadState(): PromotionsState {
    try {
      const savedStateJSON = localStorage.getItem(STORAGE_KEY);
      if (savedStateJSON) {
        const savedState = JSON.parse(savedStateJSON);
        // 合併已儲存的設定與預設值，以確保新欄位能正確初始化
        return {
            ...defaultState,
            ...savedState,
            // 確保深層物件也被正確合併
            singleItemDeal: { ...defaultState.singleItemDeal, ...(savedState.singleItemDeal || {}) },
            spendAndGet: { ...defaultState.spendAndGet, ...(savedState.spendAndGet || {}) },
            spendAndDiscount: { ...defaultState.spendAndDiscount, ...(savedState.spendAndDiscount || {}) },
        };
      }
    } catch (error) {
      console.error("無法讀取優惠設定:", error);
    }
    return defaultState;
  }

  // 5. 使用 Watcher 自動儲存到 localStorage
  watch(
    state,
    (newState) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      } catch (error) {
        console.error("無法儲存優惠設定:", error);
      }
    },
    { deep: true } // 深度監聽以捕捉內部物件的變更
  );

  // 6. Getters (使用 computed 導出唯讀狀態)，加入 singleItemDeal
  const singleItemDeal = computed(() => state.value.singleItemDeal);
  const spendAndGet = computed(() => state.value.spendAndGet);
  const spendAndDiscount = computed(() => state.value.spendAndDiscount);

  // 7. Actions (更新 state)，加入 updateSingleItemDeal
  function updateSingleItemDeal(settings: Partial<SingleItemDeal>) {
    state.value.singleItemDeal = { ...state.value.singleItemDeal, ...settings };
  }

  function updateSpendAndGet(settings: Partial<SpendAndGet>) {
    state.value.spendAndGet = { ...state.value.spendAndGet, ...settings };
  }

  function updateSpendAndDiscount(settings: Partial<SpendAndDiscount>) {
    state.value.spendAndDiscount = { ...state.value.spendAndDiscount, ...settings };
  }

  return {
    singleItemDeal, // 導出
    spendAndGet,
    spendAndDiscount,
    updateSingleItemDeal, // 導出
    updateSpendAndGet,
    updateSpendAndDiscount,
  };
});
