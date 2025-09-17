import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { MenuItem } from './menu';

// 1. 訂單項目與訂單的型別定義
export interface OrderItem {
  id: string; // 使用 MenuItem 的 id
  name: string;
  price: number;
  quantity: number;
  isGift?: boolean; // 是否為贈品
  // 移除 item: MenuItem 結構，使型別更扁平
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  timestamp: Date;
  status: '處理中' | '已完成' | '已取消';
  tableNumber?: string;
}

// localStorage 的鍵
export const ORDERS_STORAGE_KEY = 'caffe_pos_orders_state';

export const useOrdersStore = defineStore('orders', () => {
  // 2. State (使用 ref)
  const orders = ref<Order[]>([]);

  // 從 localStorage 初始化 State
  const savedState = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState) as Order[];
      // 將 ISO 字串轉換回 Date 物件
      orders.value = parsed.map(order => ({
        ...order,
        timestamp: new Date(order.timestamp),
      }));
    } catch (e) {
      console.error("無法從 localStorage 解析訂單:", e);
      orders.value = [];
    }
  }

  // 3. Getters (使用 computed)
  const totalRevenue = computed(() => 
    orders.value
      .filter(o => o.status === '已完成')
      .reduce((total, order) => total + order.total, 0)
  );

  const pendingRevenue = computed(() =>
    orders.value
      .filter(o => o.status === '處理中')
      .reduce((total, order) => total + order.total, 0)
  );

  const totalOrdersCount = computed(() => orders.value.length);

  // 4. Actions (函式)
  function addOrder(newOrder: { items: OrderItem[]; tableNumber?: string }) {
    const total = newOrder.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderWithId: Order = {
      ...newOrder,
      id: `order-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date(),
      status: '處理中',
      total,
    };
    orders.value.unshift(orderWithId);
  }

  function updateOrderStatus(orderId: string, status: Order['status']) {
    const order = orders.value.find(o => o.id === orderId);
    if (order) {
      order.status = status;
    }
  }

  function clearAllOrders() {
    orders.value = [];
  }
  
  // 5. 使用 Watcher 自動儲存到 localStorage
  watch(
    orders,
    (newOrders) => {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(newOrders));
    },
    { deep: true } // 深度監聽以捕捉內部物件的變更
  );

  return {
    orders,
    totalRevenue,
    pendingRevenue,
    totalOrdersCount,
    addOrder,
    updateOrderStatus,
    clearAllOrders,
  };
});
