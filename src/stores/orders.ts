import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

// 1. 訂單項目與訂單的型別定義
export interface OrderItem {
  id: string; 
  name: string;
  price: number;
  quantity: number;
  isGift?: boolean; 
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  timestamp: Date;
  status: '處理中' | '已完成' | '已取消';
  tableNumber?: string;
  paymentMethod: 'cash' | 'linepay'; // <--- 新增付款方式
}

// localStorage 的鍵
export const ORDERS_STORAGE_KEY = 'caffe_pos_orders_state';

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref<Order[]>([]);

  // 從 localStorage 初始化 State
  const savedState = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState) as Order[];
      orders.value = parsed.map(order => ({
        ...order,
        timestamp: new Date(order.timestamp),
        // 確保舊訂單有預設值
        paymentMethod: order.paymentMethod || 'cash', 
      }));
    } catch (e) {
      console.error("無法從 localStorage 解析訂單:", e);
      orders.value = [];
    }
  }

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

  // 升級 addOrder 函式以包含 paymentMethod
  function addOrder(newOrder: { items: OrderItem[]; tableNumber?: string; paymentMethod: 'cash' | 'linepay' }) {
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

  function deleteOrder(orderId: string) {
    const index = orders.value.findIndex(o => o.id === orderId);
    if (index !== -1) {
      orders.value.splice(index, 1);
    }
  }

  function clearAllOrders() {
    orders.value = [];
  }

  function clearCompletedOrders() {
    orders.value = orders.value.filter(order => order.status !== '已完成');
  }
  
  watch(
    orders,
    (newOrders) => {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(newOrders));
    },
    { deep: true } 
  );

  return {
    orders,
    totalRevenue,
    pendingRevenue,
    totalOrdersCount,
    addOrder,
    updateOrderStatus,
    deleteOrder,
    clearAllOrders,
    clearCompletedOrders,
  };
});
