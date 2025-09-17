
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useReservationsStore = defineStore('reservations', () => {
  // --- State ---
  const reservations = ref([
    // Example reservation object:
    // {
    //   id: 1,
    //   name: '王先生',
    //   date: '2024-07-28',
    //   time: '18:30',
    //   guests: 4,
    //   babyChairs: 1,
    //   notes: '需要靠窗位置'
    // }
  ]);
  let nextId = ref(1);

  // --- Getters ---
  const reservationsByDate = computed(() => {
    return (date) => reservations.value.filter(r => r.date === date).sort((a, b) => a.time.localeCompare(b.time));
  });

  // --- Actions ---
  function addReservation(reservationData) {
    const newReservation = {
      ...reservationData,
      id: nextId.value++,
      babyChairs: reservationData.babyChairs || 0, // Ensure babyChairs has a value
      notes: reservationData.notes || '' // Add notes field
    };
    reservations.value.push(newReservation);
  }

  function updateReservation(updatedReservation) {
    const index = reservations.value.findIndex(r => r.id === updatedReservation.id);
    if (index !== -1) {
      reservations.value[index] = {
          ...updatedReservation,
          babyChairs: updatedReservation.babyChairs || 0,
          notes: updatedReservation.notes || '' // Add notes field
      };
    }
  }

  function deleteReservation(reservationId) {
    reservations.value = reservations.value.filter(r => r.id !== reservationId);
  }

  return {
    reservations,
    reservationsByDate,
    addReservation,
    updateReservation,
    deleteReservation,
  };
});
