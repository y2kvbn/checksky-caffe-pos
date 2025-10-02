import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useReservationsStore = defineStore('reservations', () => {
  const reservations = ref([
    // ... (existing reservation data)
  ]);

  function getNextId() {
    return reservations.value.length > 0 ? String(Math.max(...reservations.value.map(r => Number(r.id))) + 1) : '1';
  }

  function addReservation(reservation) {
    reservations.value.push({ ...reservation, id: getNextId() });
  }

  function updateReservation(updatedReservation) {
    const index = reservations.value.findIndex(r => r.id === updatedReservation.id);
    if (index !== -1) {
      reservations.value[index] = updatedReservation;
    }
  }

  function deleteReservation(reservationId) {
    reservations.value = reservations.value.filter(r => r.id !== reservationId);
  }

  return { 
    reservations, 
    addReservation, 
    updateReservation, 
    deleteReservation, 
  };
});
