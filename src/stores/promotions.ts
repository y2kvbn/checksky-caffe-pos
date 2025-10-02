import { defineStore } from 'pinia';
import { ref, watch, computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = '向天泓咖啡廳_優惠設定_v4'; // 版本提升

// 1. 優惠活動類型不變
export type PromotionType = 'SINGLE_ITEM_DEAL' | 'SPEND_AND_DISCOUNT' | 'SPEND_AND_GET';

// 2. 定義每種優惠活動的具體結構
export interface BasePromotion {
  id: string;
  enabled: boolean;
  name: string; 
  type: PromotionType;
}

// [FIX-4.1] 重構 SingleItemDeal 的資料結構
export interface DealItem {
  itemId: string | null; // 商品 ID
  discountPrice: number | null; // 折扣後的價格
}

export interface SingleItemDeal extends BasePromotion {
  type: 'SINGLE_ITEM_DEAL';
  // items 陣列，包含多個獨立的優惠品項
  items: [DealItem, DealItem]; 
}

export interface SpendAndDiscount extends BasePromotion {
  type: 'SPEND_AND_DISCOUNT';
  threshold: number; 
  discount: number; 
}

export interface SpendAndGet extends BasePromotion {
  type: 'SPEND_AND_GET';
  threshold: number; 
  giftName: string; 
}

export type Promotion = SingleItemDeal | SpendAndDiscount | SpendAndGet;

interface PromotionsState {
  promotions: Promotion[];
}

// 預設狀態更新
const defaultState: PromotionsState = {
  promotions: [
    {
      id: 'promo-1',
      enabled: true,
      name: '單品特價活動',
      type: 'SINGLE_ITEM_DEAL',
      // [FIX-4.1] 更新預設資料以符合新結構
      items: [
        { itemId: 'hpt01', discountPrice: 350 },
        { itemId: null, discountPrice: null }, // 第二個位置留空
      ],
    },
    {
      id: 'promo-2',
      enabled: true,
      name: '滿額折扣活動',
      type: 'SPEND_AND_DISCOUNT',
      threshold: 1000,
      discount: 90, // 9 折, 代表支付 90%
    },
    {
      id: 'promo-3',
      enabled: false, 
      name: '滿額贈品活動',
      type: 'SPEND_AND_GET',
      threshold: 600,
      giftName: '主廚精選甜點一份',
    },
  ],
};

export const usePromotionsStore = defineStore('promotions', () => {
  const promotions = ref<Promotion[]>(loadState());

  function loadState(): Promotion[] {
    try {
      const savedStateJSON = localStorage.getItem(STORAGE_KEY);
      if (savedStateJSON) {
        // 由於結構變動較大，直接返回解析後的存檔，或在未來加入更複雜的遷移邏輯
        return JSON.parse(savedStateJSON);
      }
    } catch (error) {
      console.error("無法讀取優惠設定:", error);
    }
    // 如果沒有存檔或讀取失敗，返回全新的預設值
    return defaultState.promotions;
  }

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

  const allPromotions = computed(() => promotions.value);
  const activePromotions = computed(() => promotions.value.filter(p => p.enabled));

  function getPromotionById(id: string): Promotion | undefined {
    return promotions.value.find(p => p.id === id);
  }

  function addPromotion(newPromoData: Omit<Promotion, 'id'>) {
    const newPromotion: Promotion = {
      ...newPromoData,
      id: uuidv4(),
    } as Promotion;
    promotions.value.push(newPromotion);
  }

  function updatePromotion(id: string, updates: Partial<Promotion>) {
    const index = promotions.value.findIndex(p => p.id === id);
    if (index !== -1) {
        const currentPromo = promotions.value[index];
        // 使用 structuredClone 進行深度合併，以處理巢狀物件
        const updatedPromo = { ...currentPromo, ...updates };
        promotions.value.splice(index, 1, updatedPromo);
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

  return {
    promotions: allPromotions,
    activePromotions,
    getPromotionById,
    addPromotion,
    updatePromotion,
    deletePromotion,
    togglePromotion,
  };
});
