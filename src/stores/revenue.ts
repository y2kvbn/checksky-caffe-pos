import { defineStore } from 'pinia';

export interface RevenueRecord {
  id: string;
  date: string;
  totalRevenue: number;
  totalOrders: number;
  cashTotal: number;
  linePayTotal: number;
}

export const useRevenueStore = defineStore('revenue', {
  state: () => ({
    revenueHistory: [] as RevenueRecord[],
  }),
  actions: {
    addRevenueRecord(record: Omit<RevenueRecord, 'id'>) {
      const newRecord: RevenueRecord = {
        ...record,
        id: `rev-${new Date().getTime()}`,
      };
      this.revenueHistory.push(newRecord);
    },
  },
  persist: true, // This will persist the store data in localStorage
});
