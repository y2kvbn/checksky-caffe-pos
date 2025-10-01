
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// 來自 menu.ts：為菜單項目定義清晰的介面
export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
  image: string;
  isSetMeal?: boolean;
  isStandardDrink?: boolean;
}

// 輔助函式：產生隨機 ID
const generateId = () => Math.random().toString(36).substring(2, 9);

export const useMenuStore = defineStore('menu', () => {

  // 來自 menu.js：圖片 URL 的集中管理
  const imageUrls: Record<string, string> = {
    '特色風味小火鍋': 'https://img.freepik.com/premium-photo/image-japanese-food-that-shabushabu-good-apply-book-menu_1047722-2615.jpg',
    '特色風味簡餐': 'https://img.freepik.com/free-photo/stired-chicken-with-kimchi-sauce_1339-6781.jpg',
    '單品咖啡': 'https://img.freepik.com/premium-photo/glass-iced-coffee-with-spoon-coffee-beans-napkin_1118577-4241.jpg',
    '義式咖啡': 'https://img.freepik.com/free-photo/delicious-quality-coffee-cup_23-2150691439.jpg',
    '茶': 'https://img.freepik.com/free-photo/tea-cups-assortment-wooden-board_23-2148786626.jpg',
    '無咖啡因飲品': 'https://img.freepik.com/premium-photo/glass-cold-brew-coffee-beans-table-against-light-background_1235831-118571.jpg',
    '甜點': 'https://img.freepik.com/free-photo/delicious-cake-stand_23-2150797776.jpg',
    '炸物': 'https://img.freepik.com/free-photo/fast-food-restaurant-table_7939-2830.jpg',
    '加點': 'https://file.phew.tw/content/article/web_pic_2021_07_20_14_41_03.jpeg'
  };

  // 來自 menu.js：使用原始的菜單資料，並套用 MenuItem 型別
  const items = ref<MenuItem[]>([
    // ... (此處省略所有菜單項目，以 menu.js 的版本為準) ...
    { id: 'hpt01', name: '蕃茄牛奶鍋 (雞肉)', category: '特色風味小火鍋', price: 400, inStock: true, image: imageUrls['特色風味小火鍋'], isSetMeal: true },
    { id: 'hpt02', name: '泰式酸辣鍋 (雞肉)', category: '特色風味小火鍋', price: 380, inStock: true, image: imageUrls['特色風味小火鍋'], isSetMeal: true },
    { id: 'hpt03', name: '賽夏馬告鍋 (雞肉)', category: '特色風味小火鍋', price: 380, inStock: true, image: imageUrls['特色風味小火鍋'], isSetMeal: true },
    { id: 'hpt04', name: '賽夏馬告鍋 (素)', category: '特色風味小火鍋', price: 320, inStock: true, image: imageUrls['特色風味小火鍋'], isSetMeal: true },
    { id: 'hpt05', name: '羊奶樹根鍋 (雞肉)', category: '特色風味小火鍋', price: 420, inStock: true, image: imageUrls['特色風味小火鍋'], isSetMeal: true },
    { id: 'hpt06', name: '羊奶樹根鍋 (素)', category: '特色風味小火鍋', price: 360, inStock: true, image: imageUrls['特色風味小火鍋'], isSetMeal: true },
    { id: 'hpt07', name: '十全養生鍋 (雞肉)', category: '特色風味小火鍋', price: 400, inStock: true, image: imageUrls['特色風味小火鍋'], isSetMeal: true },
    { id: 'hpt08', name: '十全養生鍋 (素)', category: '特色風味小火鍋', price: 340, inStock: true, image: imageUrls['特色風味小火鍋'], isSetMeal: true },
    { id: 'mel01', name: '風味烤雞腿排', category: '特色風味簡餐', price: 280, inStock: true, image: imageUrls['特色風味簡餐'], isSetMeal: true },
    { id: 'mel02', name: '紅酒燉牛肉', category: '特色風味簡餐', price: 320, inStock: true, image: imageUrls['特色風味簡餐'], isSetMeal: true },
    { id: 'cof01', name: '手沖肯亞', category: '單品咖啡', price: 180, inStock: true, image: imageUrls['單品咖啡'] },
    { id: 'esp01', name: '經典拿鐵', category: '義式咖啡', price: 150, inStock: true, image: imageUrls['義式咖啡'] },
    { id: 'esp02', name: '卡布奇諾', category: '義式咖啡', price: 150, inStock: true, image: imageUrls['義式咖啡'] },
    { id: 'esp03', name: '冰咖啡', category: '義式咖啡', price: 100, inStock: true, image: imageUrls['義式咖啡'], isStandardDrink: true },
    { id: 'esp04', name: '熱咖啡', category: '義式咖啡', price: 100, inStock: true, image: imageUrls['義式咖啡'], isStandardDrink: true },
    { id: 'tea01', name: '阿里山烏龍', category: '茶', price: 120, inStock: true, image: imageUrls['茶'] },
    { id: 'tea02', name: '冰紅茶', category: '茶', price: 80, inStock: true, image: imageUrls['茶'], isStandardDrink: true },
    { id: 'tea03', name: '熱紅茶', category: '茶', price: 80, inStock: true, image: imageUrls['茶'], isStandardDrink: true },
    { id: 'dec01', name: '南非國寶茶', category: '無咖啡因飲品', price: 130, inStock: true, image: imageUrls['無咖啡因飲品'] },
    { id: 'dec02', name: '乳酸菌', category: '無咖啡因飲品', price: 90, inStock: true, image: imageUrls['無咖啡因飲品'], isStandardDrink: true },
    { id: 'des01', name: '提拉米蘇', category: '甜點', price: 120, inStock: true, image: imageUrls['甜點'] },
    { id: 'des02', name: '紐約起司蛋糕', category: '甜點', price: 130, inStock: true, image: imageUrls['甜點'] },
    { id: 'fri01', name: '美式炸物拼盤', category: '炸物', price: 250, inStock: true, image: imageUrls['炸物'] },
    { id: 'add01', name: '額外加點白飯', category: '加點', price: 10, inStock: true, image: imageUrls['加點'] },
  ]);

  // 來自 menu.js：可變的分類列表
  const categories = ref<string[]>([
    '特色風味小火鍋',
    '特色風味簡餐',
    '單品咖啡',
    '義式咖啡',
    '茶',
    '無咖啡因飲品',
    '甜點',
    '炸物',
    '加點'
  ]);

  // 來自 menu.js：包含 "全部" 的計算屬性
  const allCategories = computed(() => ['全部', ...categories.value]);
  
  // 來自 menu.ts：方便的查詢函式
  const getItemById = (id: string): MenuItem | undefined => items.value.find(item => item.id === id);

  // 來自 menu.js：具備完整邏輯的 addItem，並加上型別
  function addItem(item: Omit<MenuItem, 'id' | 'inStock'>) {
    const imageUrl = imageUrls[item.category] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop';
    items.value.unshift({ ...item, id: generateId(), inStock: true, image: imageUrl });
  }
  
  // 來自 menu.js：具備完整邏輯的 updateItem，並加上型別
  function updateItem(updatedItem: Partial<MenuItem> & { id: string }) {
    const index = items.value.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
      // 如果分類改變，要更新圖片
      const newImage = updatedItem.category ? (imageUrls[updatedItem.category] || items.value[index].image) : items.value[index].image;
      items.value[index] = { ...items.value[index], ...updatedItem, image: newImage };
    }
  }

  // 來自 menu.js：deleteItem 函式
  function deleteItem(itemId: string) {
    items.value = items.value.filter(item => item.id !== itemId);
  }

  // --- 以下是從 menu.js 移植過來的分類管理功能 ---

  function addCategory(categoryName: string) {
    if (categoryName && !categories.value.includes(categoryName)) {
      categories.value.push(categoryName);
      // 為新分類提供一個預設圖片
      if (!imageUrls[categoryName]) {
          imageUrls[categoryName] = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop';
      }
    }
  }

  function updateCategory({ oldName, newName }: { oldName: string, newName: string }) {
    if (!newName || oldName === newName || categories.value.includes(newName)) return;
    const index = categories.value.findIndex(c => c === oldName);
    if (index !== -1) {
      categories.value[index] = newName;
      // 更新所有相關菜單項目的分類
      items.value.forEach(item => {
        if (item.category === oldName) {
          item.category = newName;
        }
      });
      // 更新圖片 URL 對應
      if (imageUrls[oldName]) {
        imageUrls[newName] = imageUrls[oldName];
        delete imageUrls[oldName];
      }
    }
  }

  function deleteCategory(categoryName: string) {
    const isCategoryInUse = items.value.some(item => item.category === categoryName);
    if (isCategoryInUse) {
      alert('無法刪除此分類，因為尚有菜單項目正在使用。');
      return;
    }
    categories.value = categories.value.filter(c => c !== categoryName);
    // 刪除對應的圖片 URL
    if (imageUrls[categoryName]) {
      delete imageUrls[categoryName];
    }
  }

  // 導出所有 state 和 actions
  return { 
    items, 
    categories, 
    allCategories, 
    addItem, 
    updateItem, 
    deleteItem, 
    addCategory, 
    updateCategory, 
    deleteCategory,
    getItemById
  };
});
