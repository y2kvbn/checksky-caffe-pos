import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

// 1. 定義預約的 TypeScript 介面
export interface Reservation {
  id: number;
  name: string;
  date: string; // 格式 YYYY-MM-DD
  time: string; // 格式 HH:MM
  guests: number;
  babyChairs: number;
  notes?: string; // 備註 (可選)
}

// 2. localStorage 的鍵
const RESERVATIONS_STORAGE_KEY = 'caffe_pos_reservations';
const NEXT_ID_STORAGE_KEY = 'caffe_pos_reservations_next_id';

export const useReservationsStore = defineStore('reservations', () => {
  // --- State ---
  // 3. 從 localStorage 初始化 State
  const reservations = ref<Reservation[]>(JSON.parse(localStorage.getItem(RESERVATIONS_STORAGE_KEY) || '[]'));
  const nextId = ref<number>(parseInt(localStorage.getItem(NEXT_ID_STORAGE_KEY) || '1', 10));

  // --- Watcher 自動儲存 ---
  watch(reservations, (newReservations) => {
    localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(newReservations));
  }, { deep: true });

  watch(nextId, (newId) => {
    localStorage.setItem(NEXT_ID_STORAGE_KEY, newId.toString());
  });

  // --- Getters ---
  const reservationsByDate = computed(() => 
    (date: string): Reservation[] => 
      reservations.value
        .filter(r => r.date === date)
        .sort((a, b) => a.time.localeCompare(b.time))
  );

  const getReservationById = computed(() => 
    (id: number): Reservation | undefined => 
      reservations.value.find(r => r.id === id)
  );

  // --- Actions ---
  function addReservation(reservationData: Omit<Reservation, 'id'>) {
    const newReservation: Reservation = {
      ...reservationData,
      id: nextId.value++,
      guests: Math.max(1, reservationData.guests), // 確保至少有 1 位客人
      babyChairs: Math.max(0, reservationData.babyChairs || 0),
    };
    reservations.value.push(newReservation);
  }

  function updateReservation(updatedReservation: Reservation) {
    const index = reservations.value.findIndex(r => r.id === updatedReservation.id);
    if (index !== -1) {
      reservations.value[index] = {
          ...updatedReservation,
          guests: Math.max(1, updatedReservation.guests),
          babyChairs: Math.max(0, updatedReservation.babyChairs || 0),
      };
    }
  }

  function deleteReservation(reservationId: number) {
    reservations.value = reservations.value.filter(r => r.id !== reservationId);
  }

  return {
    reservations,
    reservationsByDate,
    getReservationById,
    addReservation,
    updateReservation,
    deleteReservation,
  };
});
