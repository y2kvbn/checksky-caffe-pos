import { defineStore } from 'pinia'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [],
    nextOrderId: 1,
  }),
  actions: {
    addOrder(order) {
        const orderWithId = {
            ...order,
            id: this.nextOrderId,
            timestamp: new Date(),
            status: '處理中'
        };
      this.orders.unshift(orderWithId);
      this.nextOrderId++;
    },
    updateOrderStatus(orderId, status) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.status = status;
        }
    }
  },
  getters: {
    totalRevenue: (state) => {
        return state.orders.filter(o => o.status === '已完成').reduce((total, order) => total + order.total, 0);
    },
    pendingRevenue: (state) => {
        return state.orders.filter(o => o.status === '處理中').reduce((total, order) => total + order.total, 0);
    },
    totalOrdersCount: (state) => {
        return state.orders.length;
    }
  }
})
