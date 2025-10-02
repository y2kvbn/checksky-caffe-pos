import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

// 1. 訂單項目與訂單的型別定義
export interface OrderItem {
  id: string; 
  name: string;
  price: number;
  quantity: number;
  isGift?: boolean; 
  subItems?: OrderItem[];
}

// [FIX-10] 為 Order 介面新增 orderNumber 屬性
export interface Order {
  id: string;
  orderNumber: number; // 獨一無二的訂單編號
  items: OrderItem[];
  subtotal: number; 
  discount: number; 
  total: number; 
  appliedPromotions: { name: string; amount: number }[]; 
  timestamp: Date;
  status: '處理中' | '已完成' | '已取消';
  tableNumber?: string;
  paymentMethod: 'cash' | 'linepay';
}

// --- localStorage 的鍵 ---
export const ORDERS_STORAGE_KEY = 'caffe_pos_orders_state';
// [FIX-10] 新增用於儲存計數器的鍵
export const COUNTER_STORAGE_KEY = 'caffe_pos_daily_counter_state';


export const useOrdersStore = defineStore('orders', () => {
  const orders = ref<Order[]>([]);

  // [FIX-10] 建立每日訂單計數器 (戶政事務所)
  const dailyCounter = ref({ count: 0, date: new Date().toISOString().split('T')[0] });

  // --- 從 localStorage 初始化 State ---

  // 載入計數器
  const savedCounter = localStorage.getItem(COUNTER_STORAGE_KEY);
  if (savedCounter) {
    const parsedCounter = JSON.parse(savedCounter);
    const today = new Date().toISOString().split('T')[0];
    // 如果儲存的日期是今天，就沿用計數；否則，重設為 1
    if (parsedCounter.date === today) {
      dailyCounter.value = parsedCounter;
    } else {
      dailyCounter.value = { count: 0, date: today };
    }
  }

  // 載入訂單
  const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (savedOrders) {
    try {
      const parsed = JSON.parse(savedOrders) as (Order & {orderNumber?: number})[]; // 讓 orderNumber 成為可選，以相容舊資料
      const mappedOrders = parsed.map((order, index) => ({
        ...order,
        // [FIX-10] 如果舊訂單沒有 orderNumber，則為其補上一個 (通常是基於其在舊陣列中的位置)
        orderNumber: order.orderNumber || (index + 1),
        timestamp: new Date(order.timestamp),
        paymentMethod: order.paymentMethod || 'cash',
        subtotal: order.subtotal || order.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        discount: order.discount || 0,
        appliedPromotions: order.appliedPromotions || [],
        items: order.items.map(item => ({ ...item, subItems: item.subItems || [] }))
      }));
      mappedOrders.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      orders.value = mappedOrders;
    } catch (e) {
      console.error("無法從 localStorage 解析訂單:", e);
      orders.value = [];
    }
  }

  // --- Computed Properties ---
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

  // --- Actions ---

  // [FIX-10] 改造 addOrder，使其能夠生成並指派 orderNumber
  function addOrder(newOrder: { 
    items: OrderItem[]; 
    tableNumber?: string; 
    paymentMethod: 'cash' | 'linepay';
    appliedPromotions: { name: string; amount: number }[];
    subtotal: number;
    discount: number;
    total: number;
  }) {
    const today = new Date().toISOString().split('T')[0];
    // 如果計數器的日期不是今天，就重置它
    if (dailyCounter.value.date !== today) {
      dailyCounter.value = { count: 0, date: today };
    }

    // 計數器加一
    dailyCounter.value.count++;

    const orderWithId: Order = {
      ...newOrder,
      id: `order-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      orderNumber: dailyCounter.value.count, // 從戶政事務所請領號碼牌
      timestamp: new Date(),
      status: '處理中',
    };
    orders.value.unshift(orderWithId);
  }

  function updateOrderStatus(orderId: string, status: Order['status']) {
    const order = orders.value.find(o => o.id === orderId);
    if (order) { order.status = status; }
  }

  function deleteOrder(orderId: string) {
    const index = orders.value.findIndex(o => o.id === orderId);
    if (index !== -1) { orders.value.splice(index, 1); }
  }

  function clearAllOrders() {
    orders.value = [];
    // 清空訂單時，也應該重置計數器
    dailyCounter.value.count = 0;
  }

  function clearCompletedOrders() {
    orders.value = orders.value.filter(order => order.status !== '已完成');
  }
  
  // --- Watchers (持久化) ---
  watch(orders, (newOrders) => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(newOrders));
  }, { deep: true });

  // [FIX-10] 新增對計數器的監控，以將其狀態持久化
  watch(dailyCounter, (newCounter) => {
    localStorage.setItem(COUNTER_STORAGE_KEY, JSON.stringify(newCounter));
  }, { deep: true });


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
