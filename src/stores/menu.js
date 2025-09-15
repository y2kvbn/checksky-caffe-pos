
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useMenuStore = defineStore('menu', () => {

  const imageUrls = {
    '特色風味小火鍋': 'https://img.freepik.com/premium-photo/image-japanese-food-that-shabushabu-good-apply-book-menu_1047722-2615.jpg',
    '特色風味簡餐': 'https://img.freepik.com/free-photo/stired-chicken-with-kimchi-sauce_1339-6781.jpg',
    '單品咖啡': 'https://img.freepik.com/premium-photo/glass-iced-coffee-with-spoon-coffee-beans-napkin_1118577-4241.jpg',
    '義式咖啡': 'https://img.freepik.com/free-photo/delicious-quality-coffee-cup_23-2150691439.jpg',
    '茶': 'https://img.freepik.com/free-photo/tea-cups-assortment-wooden-board_23-2148786626.jpg',
    '無咖啡因飲品': 'https://img.freepik.com/premium-photo/glass-cold-brew-coffee-beans-table-against-light-background_1235831-118571.jpg',
    '甜點': 'https://img.freepik.com/free-photo/delicious-cake-stand_23-2150797776.jpg',
    '炸物': 'https://img.freepik.com/free-photo/fast-food-restaurant-table_7939-2830.jpg',
    '加點': 'https://img.freepik.com/free-photo/steamed-rice-bowl_1339-1663.jpg'
  };

  const items = ref([
    // 特色風味小火鍋 (Set Meals)
    { id: 'hpt01', name: '蕃茄牛奶鍋 (雞肉)', category: '特色風味小火鍋', price: 400, inStock: true, image: imageUrls['特色風味小火鍋'], isSetMeal: true },
    { id: 'hpt02', name: '泰式酸辣鍋 (雞肉)', category: '特色風味小火鍋', price: 380, inStock: true, image: imageUrls['特色風味小火鍋'], isSetMeal: true },
    { id: 'hpt03', name: '賽夏馬告鍋 (雞肉)', category: '特色風味小火鍋', price: 380, inStock: true, image: imageUrls['特色風味小火鍋'], isSetMeal: true },
    { id: 'hpt04', name: '賽夏馬告鍋 (素)', category: '特色風味小火鍋', price: 320, inStock: true, image: imageUrls['特色風味小火鍋'], isSetMeal: true },
    { id: 'hpt05', name: '羊奶樹根鍋 (雞肉)', category: '特色風味小火鍋', price: 420, inStock: true, image: imageUrls['特色風味小火鍋'], isSetMeal: true },
    { id: 'hpt06', name: '羊奶樹根鍋 (素)', category: '特色風味小火鍋', price: 360, inStock: true, image: imageUrls['特色風味小火鍋'], isSetMeal: true },
    { id: 'hpt07', name: '十全養生鍋 (雞肉)', category: '特色風味小火鍋', price: 400, inStock: true, image: imageUrls['特色風味小火鍋'], isSetMeal: true },
    { id: 'hpt08', name: '十全養生鍋 (素)', category: '特色風味小火鍋', price: 340, inStock: true, image: imageUrls['特色風味小火鍋'], isSetMeal: true },
    
    // 特色風味簡餐 (Set Meals)
    { id: 'mel01', name: '風味烤雞腿排', category: '特色風味簡餐', price: 280, inStock: true, image: imageUrls['特色風味簡餐'], isSetMeal: true },
    { id: 'mel02', name: '紅酒燉牛肉', category: '特色風味簡餐', price: 320, inStock: true, image: imageUrls['特色風味簡餐'], isSetMeal: true },

    // 單品咖啡
    { id: 'cof01', name: '手沖肯亞', category: '單品咖啡', price: 180, inStock: true, image: imageUrls['單品咖啡'] },

    // 義式咖啡
    { id: 'esp01', name: '經典拿鐵', category: '義式咖啡', price: 150, inStock: true, image: imageUrls['義式咖啡'] },
    { id: 'esp02', name: '卡布奇諾', category: '義式咖啡', price: 150, inStock: true, image: imageUrls['義式咖啡'] },
    { id: 'esp03', name: '冰咖啡', category: '義式咖啡', price: 100, inStock: true, image: imageUrls['義式咖啡'], isStandardDrink: true },
    { id: 'esp04', name: '熱咖啡', category: '義式咖啡', price: 100, inStock: true, image: imageUrls['義式咖啡'], isStandardDrink: true },


    // 茶
    { id: 'tea01', name: '阿里山烏龍', category: '茶', price: 120, inStock: true, image: imageUrls['茶'] },
    { id: 'tea02', name: '冰紅茶', category: '茶', price: 80, inStock: true, image: imageUrls['茶'], isStandardDrink: true },
    { id: 'tea03', name: '熱紅茶', category: '茶', price: 80, inStock: true, image: imageUrls['茶'], isStandardDrink: true },

    // 無咖啡因飲品
    { id: 'dec01', name: '南非國寶茶', category: '無咖啡因飲品', price: 130, inStock: true, image: imageUrls['無咖啡因飲品'] },
    { id: 'dec02', name: '乳酸菌', category: '無咖啡因飲品', price: 90, inStock: true, image: imageUrls['無咖啡因飲品'], isStandardDrink: true },
    
    // 甜點
    { id: 'des01', name: '提拉米蘇', category: '甜點', price: 120, inStock: true, image: imageUrls['甜點'] },
    { id: 'des02', name: '紐約起司蛋糕', category: '甜點', price: 130, inStock: true, image: imageUrls['甜點'] },

    // 炸物
    { id: 'fri01', name: '美式炸物拼盤', category: '炸物', price: 250, inStock: true, image: imageUrls['炸物'] },

    // 加點
    { id: 'add01', name: '額外加點白飯', category: '加點', price: 10, inStock: true, image: imageUrls['加點'] },
  ]);

  const categories = computed(() => {
    const orderedCategories = [
        '特色風味小火鍋', 
        '特色風味簡餐', 
        '單品咖啡', 
        '義式咖啡', 
        '茶', 
        '無咖啡因飲品', 
        '甜點', 
        '炸物',
        '加點'
    ];
    return ['全部', ...orderedCategories];
  });
  
  function addItem(item) {
    const imageUrl = imageUrls[item.category] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop';
    items.value.unshift({ ...item, id: generateId(), inStock: true, image: imageUrl });
  }

  function updateItem(updatedItem) {
    const index = items.value.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
      const newImage = imageUrls[updatedItem.category] || items.value[index].image;
      items.value[index] = { ...items.value[index], ...updatedItem, image: newImage };
    }
  }

  function deleteItem(itemId) {
    items.value = items.value.filter(item => item.id !== itemId);
  }

  return { items, categories, addItem, updateItem, deleteItem };
});
