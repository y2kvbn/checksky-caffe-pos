import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

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

export const useMenuStore = defineStore('menu', () => {
  const items = ref<MenuItem[]>([
    { id: 'hpt01', name: '蕃茄牛奶鍋 (雞肉)', category: '特色風味小火鍋', price: 400, inStock: true, image: 'https://images.weserv.nl/?url=i.ibb.co/GP41BT1/hot-pot.jpg&w=400&q=80', isSetMeal: true },
    { id: 'hpt02', name: '泰式酸辣鍋 (雞肉)', category: '特色風味小火鍋', price: 380, inStock: true, image: 'https://images.weserv.nl/?url=i.ibb.co/GP41BT1/hot-pot.jpg&w=400&q=80', isSetMeal: true },
    { id: 'hpt03', name: '賽夏馬告鍋 (雞肉)', category: '特色風味小火鍋', price: 380, inStock: true, image: 'https://images.weserv.nl/?url=i.ibb.co/GP41BT1/hot-pot.jpg&w=400&q=80', isSetMeal: true },
    { id: 'hpt04', name: '賽夏馬告鍋 (素)', category: '特色風味小火鍋', price: 320, inStock: true, image: 'https://images.weserv.nl/?url=i.ibb.co/GP41BT1/hot-pot.jpg&w=400&q=80', isSetMeal: true },
    { id: 'hpt05', name: '羊奶樹根鍋 (雞肉)', category: '特色風味小火鍋', price: 420, inStock: true, image: 'https://images.weserv.nl/?url=i.ibb.co/GP41BT1/hot-pot.jpg&w=400&q=80', isSetMeal: true },
    { id: 'hpt06', name: '羊奶樹根鍋 (素)', category: '特色風味小火鍋', price: 360, inStock: true, image: 'https://images.weserv.nl/?url=i.ibb.co/GP41BT1/hot-pot.jpg&w=400&q=80', isSetMeal: true },
    { id: 'hpt07', name: '十全養生鍋 (雞肉)', category: '特色風味小火鍋', price: 400, inStock: true, image: 'https://images.weserv.nl/?url=i.ibb.co/GP41BT1/hot-pot.jpg&w=400&q=80', isSetMeal: true },
    { id: 'hpt08', name: '十全養生鍋 (素)', category: '特色風味小火鍋', price: 340, inStock: true, image: 'https://images.weserv.nl/?url=i.ibb.co/GP41BT1/hot-pot.jpg&w=400&q=80', isSetMeal: true },
    { id: 'mel01', name: '風味烤雞腿排', category: '特色風味簡餐', price: 280, inStock: true, image: 'https://images.weserv.nl/?url=i.ibb.co/zZxrL2n/set-meal.jpg&w=400&q=80', isSetMeal: true },
    { id: 'mel02', name: '紅酒燉牛肉', category: '特色風味簡餐', price: 320, inStock: true, image: 'https://images.weserv.nl/?url=i.ibb.co/zZxrL2n/set-meal.jpg&w=400&q=80', isSetMeal: true },
    { id: 'cof01', name: '手沖肯亞', category: '單品咖啡', price: 180, inStock: true, image: 'https://images.weserv.nl/?url=i.ibb.co/yQY1f3w/single-origin-coffee.jpg&w=400&q=80' },
    { id: 'esp01', name: '經典拿鐵', category: '義式咖啡', price: 150, inStock: true, image: 'https://images.weserv.nl/?url=i.ibb.co/XF3t8c1/espresso.jpg&w=400&q=80' },
    { id: 'esp02', name: '卡布奇諾', category: '義式咖啡', price: 150, inStock: true, image: 'https://images.weserv.nl/?url=i.ibb.co/XF3t8c1/espresso.jpg&w=400&q=80' },
    { id: 'esp03', name: '冰咖啡', category: '義式咖啡', price: 100, inStock: true, image: 'https://images.weserv.nl/?url=i.ibb.co/XF3t8c1/espresso.jpg&w=400&q=80', isStandardDrink: true },
    { id: 'esp04', name: '熱咖啡', category: '義式咖啡', price: 100, inStock: true, image: 'https://images.weserv.nl/?url=i.ibb.co/XF3t8c1/espresso.jpg&w=400&q=80', isStandardDrink: true },
    { id: 'tea01', name: '阿里山烏龍', category: '茶', price: 120, inStock: true, image: 'https://images.weserv.nl/?url=i.ibb.co/zV7M8n7/tea.jpg&w=400&q=80' },
    { id: 'tea02', name: '冰紅茶', category: '茶', price: 80, inStock: true, image: 'https://images.weserv.nl/?url=i.ibb.co/zV7M8n7/tea.jpg&w=400&q=80', isStandardDrink: true },
    { id: 'tea03', name: '熱紅茶', category: '茶', price: 80, inStock: true, image: 'https://images.weserv.nl/?url=i.ibb.co/zV7M8n7/tea.jpg&w=400&q=80', isStandardDrink: true },
    { id: 'dec01', name: '南非國寶茶', category: '無咖啡因飲品', price: 130, inStock: true, image: 'https://images.weserv.nl/?url=i.ibb.co/yQxGczT/caffeine-free.jpg&w=400&q=80' },
    { id: 'dec02', name: '乳酸菌', category: '無咖啡因飲品', price: 90, inStock: true, image: 'https://images.weserv.nl/?url=i.ibb.co/yQxGczT/caffeine-free.jpg&w=400&q=80', isStandardDrink: true },
    { id: 'des01', name: '提拉米蘇', category: '甜點', price: 120, inStock: true, image: 'https://images.weserv.nl/?url=i.ibb.co/Cbf1j7r/dessert.jpg&w=400&q=80' },
    { id: 'des02', name: '紐約起司蛋糕', category: '甜點', price: 130, inStock: true, image: 'https://images.weserv.nl/?url=i.ibb.co/Cbf1j7r/dessert.jpg&w=400&q=80' },
    { id: 'fri01', name: '美式炸物拼盤', category: '炸物', price: 250, inStock: true, image: 'https://images.weserv.nl/?url=i.ibb.co/yWdKxT9/fried-food.jpg&w=400&q=80' },
    { id: 'add01', name: '額外加點白飯', category: '加點', price: 10, inStock: true, image: 'https://images.weserv.nl/?url=i.ibb.co/P9SrzXP/side-dish.jpg&w=400&q=80' },
  ]);

  const categories = computed<string[]>(() => [
    '全部', 
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

  const getItemById = (id: string): MenuItem | undefined => items.value.find(item => item.id === id);

  function addItem(item: Omit<MenuItem, 'id' | 'inStock'>) {
    const defaultImage = 'https://images.weserv.nl/?url=i.ibb.co/pP0qmPz/pexels-valeria-boltneva-1639557.jpg&w=400&q=80&output=webp';
    items.value.unshift({ 
        ...item,
        id: `item-${Date.now()}`,
        inStock: true,
        image: item.image || defaultImage
    });
  }

  function updateItem(updatedItem: Partial<MenuItem> & { id: string }) {
    const index = items.value.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
      const originalItem = items.value[index];
      items.value[index] = { ...originalItem, ...updatedItem };
    }
  }

  function deleteItem(itemId: string) {
    items.value = items.value.filter(item => item.id !== itemId);
  }

  return { items, categories, addItem, updateItem, deleteItem, getItemById };
});