import { defineStore } from 'pinia';
import { ref, watch, computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = '向天泓咖啡廳_優惠設定_v2';

// 1. 定義優惠活動的類型
export type PromotionType = 'SINGLE_ITEM_DEAL' | 'SPEND_AND_DISCOUNT' | 'SPEND_AND_GET';

// 2. 定義每種優惠活動的具體結構
export interface BasePromotion {
  id: string;
  enabled: boolean;
  name: string; // 活動名稱，例如 "主廚推薦特餐"
  type: PromotionType;
}

export interface SingleItemDeal extends BasePromotion {
  type: 'SINGLE_ITEM_DEAL';
  itemId: string; // 商品 ID
  discountPrice: number; // 折扣後的價格
}

export interface SpendAndDiscount extends BasePromotion {
  type: 'SPEND_AND_DISCOUNT';
  threshold: number; // 消費門檻
  discount: number; // 折扣百分比 (例如 85 代表 85 折)
}

export interface SpendAndGet extends BasePromotion {
  type: 'SPEND_AND_GET';
  threshold: number; // 消費門檻
  giftName: string; // 贈品名稱
}

// 3. 使用聯合類型來代表任何一種可能的優惠活動
export type Promotion = SingleItemDeal | SpendAndDiscount | SpendAndGet;

// 4. State 的結構改為一個優惠活動的陣列
interface PromotionsState {
  promotions: Promotion[];
}

// 5. 預設狀態，現在是一個包含多個活動的陣列
const defaultState: PromotionsState = {
  promotions: [
    {
      id: 'promo-1',
      enabled: true,
      name: '蕃茄牛奶鍋特價',
      type: 'SINGLE_ITEM_DEAL',
      itemId: 'hpt01', // 假設這是蕃茄牛奶鍋(雞肉)的ID
      discountPrice: 350,
    },
    {
      id: 'promo-2',
      enabled: true,
      name: '滿千八八折',
      type: 'SPEND_AND_DISCOUNT',
      threshold: 1000,
      discount: 88, // 88 折
    },
    {
      id: 'promo-3',
      enabled: false, // 預設關閉
      name: '滿600送甜點',
      type: 'SPEND_AND_GET',
      threshold: 600,
      giftName: '主廚精選甜點一份',
    },
  ],
};

export const usePromotionsStore = defineStore('promotions', () => {
  // 6. State 現在是一個優惠活動的 Ref 陣列
  const promotions = ref<Promotion[]>(loadState());

  function loadState(): Promotion[] {
    try {
      const savedStateJSON = localStorage.getItem(STORAGE_KEY);
      if (savedStateJSON) {
        // 簡單地解析回來即可，因為我們有預設值
        return JSON.parse(savedStateJSON);
      }
    } catch (error) {
      console.error("無法讀取優惠設定:", error);
    }
    return defaultState.promotions;
  }

  // 7. Watcher 自動儲存到 localStorage
  watch(
    promotions,
    (newPromotions) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newPromotions));
      } catch (error) {
        console.error("無法儲存優惠設定:", error);
      }
    },
    { deep: true }
  );

  // 8. Getters / Computed Properties
  const allPromotions = computed(() => promotions.value);
  const activePromotions = computed(() => promotions.value.filter(p => p.enabled));

  function getPromotionById(id: string): Promotion | undefined {
    return promotions.value.find(p => p.id === id);
  }

  // 9. Actions - 新的管理功能
  function addPromotion(newPromoData: Omit<Promotion, 'id'>) {
    const newPromotion: Promotion = {
      ...newPromoData,
      id: uuidv4(), // 使用 uuid 產生唯一的 ID
    } as Promotion;
    promotions.value.push(newPromotion);
  }

  function updatePromotion(id: string, updates: Partial<Promotion>) {
    const index = promotions.value.findIndex(p => p.id === id);
    if (index !== -1) {
      // 確保 id 和 type 不被覆蓋
      const { id: originalId, type: originalType, ...restOfUpdates } = updates;
      promotions.value[index] = { 
        ...promotions.value[index], 
        ...restOfUpdates 
      };
    }
  }

  function deletePromotion(id: string) {
    promotions.value = promotions.value.filter(p => p.id !== id);
  }

  function togglePromotion(id: string) {
    const promotion = getPromotionById(id);
    if (promotion) {
      promotion.enabled = !promotion.enabled;
    }
  }

  // 10. 導出所有需要的狀態和函式
  return {
    promotions: allPromotions, // 導出 allPromotions 而不是原始的 ref
    activePromotions,
    getPromotionById,
    addPromotion,
    updatePromotion,
    deletePromotion,
    togglePromotion,
  };
});
