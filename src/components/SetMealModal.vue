
<template>
  <div v-if="visible" class="modal-overlay" @click.self="cancel">
    <div class="modal-content">
      <!-- Header -->
      <div class="modal-header">
        <h2 class="title">{{ setMeal.name }} - 套餐選項</h2>
        <button class="close-btn" @click="cancel">&times;</button>
      </div>
      <p class="description">此餐點包含白飯及一杯飲料。您可選擇預設飲料,或更換其他飲品並折抵NT$60。</p>

      <!-- Drink Selection -->
      <div class="selection-group">
        <h3 class="group-title">飲料選擇</h3>
        <div class="radio-group">
          <label :class="{ active: drinkChoiceMode === 'standard' }">
            <input type="radio" name="drink-mode" value="standard" v-model="drinkChoiceMode">
            <span class="radio-custom"></span>
            選擇附餐飲料 (免費)
          </label>
          <label :class="{ active: drinkChoiceMode === 'upgrade' }">
            <input type="radio" name="drink-mode" value="upgrade" v-model="drinkChoiceMode">
            <span class="radio-custom"></span>
            更換其他飲品 (折抵 NT$60)
          </label>
        </div>
        
        <!-- Custom Dropdown -->
        <div class="custom-dropdown-wrapper">
          <div class="dropdown-trigger" @click="toggleDropdown">
            <span>{{ selectedDrinkName }}</span>
            <span class="arrow" :class="{ open: isDropdownOpen }"></span>
          </div>
          <ul v-if="isDropdownOpen" class="dropdown-options">
            <li 
              v-for="drink in drinkOptions"
              :key="drink.id"
              :class="{ selected: drink.id === selectedDrinkId }"
              @click="selectOption(drink.id)"
            >
              <span class="checkmark" v-if="drink.id === selectedDrinkId">✓</span>
              {{ drink.name }} <span v-if="drinkChoiceMode === 'upgrade'">({{ drink.price }})</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Add Extra Rice -->
      <div class="selection-group">
        <h3 class="group-title">加點白飯 (NT$10/碗)</h3>
        <div class="counter">
          <button @click="updateExtraRice(-1)">-</button>
          <span>{{ extraRiceCount }}</span>
          <button @click="updateExtraRice(1)">+</button>
        </div>
      </div>

      <!-- Actions -->
      <div class="modal-actions">
        <button class="btn-cancel" @click="cancel">取消</button>
        <button class="btn-confirm" @click="confirm">確認加入購物車</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useMenuStore } from '../stores/menu';

const props = defineProps({
  visible: Boolean,
  setMeal: Object
});

const emit = defineEmits(['close', 'confirm']);
const menuStore = useMenuStore();

// --- State ---
const drinkChoiceMode = ref('standard'); // 'standard' or 'upgrade'
const selectedDrinkId = ref(null);
const extraRiceCount = ref(0);
const isDropdownOpen = ref(false);

// --- Computed Properties ---
const standardDrinks = computed(() => menuStore.items.filter(item => item.isStandardDrink));
const upgradeableDrinks = computed(() => menuStore.items.filter(item => 
    (item.category === '單品咖啡' || item.category === '義式咖啡' || item.category === '茶' || item.category === '無咖啡因飲品') && !item.isStandardDrink
));
const extraRiceItem = computed(() => menuStore.items.find(item => item.id === 'add01'));

const drinkOptions = computed(() => {
  return drinkChoiceMode.value === 'standard' ? standardDrinks.value : upgradeableDrinks.value;
});

const selectedDrinkName = computed(() => {
    const found = menuStore.items.find(d => d.id === selectedDrinkId.value);
    return found ? found.name : '請選擇飲料';
});

// --- Watchers ---
watch(() => props.visible, (newVal) => {
  if (newVal) {
    drinkChoiceMode.value = 'standard';
    extraRiceCount.value = 0;
    isDropdownOpen.value = false;
    if (standardDrinks.value.length > 0) {
        selectedDrinkId.value = standardDrinks.value[0].id;
    }
  }
});

watch(drinkChoiceMode, () => {
    if (drinkOptions.value.length > 0) {
        selectedDrinkId.value = drinkOptions.value[0].id;
    }
});

// --- Methods ---
function toggleDropdown() {
    isDropdownOpen.value = !isDropdownOpen.value;
}

function selectOption(drinkId) {
    selectedDrinkId.value = drinkId;
    isDropdownOpen.value = false;
}

function updateExtraRice(amount) {
  const newCount = extraRiceCount.value + amount;
  if (newCount >= 0) {
    extraRiceCount.value = newCount;
  }
}

function cancel() {
  emit('close');
}

function confirm() {
  if (!selectedDrinkId.value) {
    alert('請選擇一杯飲料！');
    return;
  }

  const selectedDrinkObject = menuStore.items.find(item => item.id === selectedDrinkId.value);
  if (!selectedDrinkObject) {
      alert('發生錯誤，找不到選擇的飲料。');
      return;
  }

  const subItems = [];
  let setMealPrice = props.setMeal.price;

  // 1. 新增附贈的白飯
  subItems.push({ id: 'rice01', name: '白飯 (附贈)', price: 0, quantity: 1, isGift: true });

  // 2. 處理飲料
  if (drinkChoiceMode.value === 'upgrade') {
    const upgradedDrink = { 
        ...selectedDrinkObject, 
        price: selectedDrinkObject.price, // 使用原始價格
        name: `${selectedDrinkObject.name} (更換)`,
        quantity: 1
    };
    subItems.push(upgradedDrink);
    // 飲料更換折抵 NT$60，從主餐價格中扣除
    setMealPrice -= 60;
  } else {
     const standardDrink = { ...selectedDrinkObject, price: 0, name: `${selectedDrinkObject.name} (附贈)`, quantity: 1, isGift: true };
     subItems.push(standardDrink);
  }

  // 3. 處理加點的白飯
  if (extraRiceCount.value > 0 && extraRiceItem.value) {
     const extraRice = { 
         ...extraRiceItem.value, 
         quantity: extraRiceCount.value 
     };
     subItems.push(extraRice);
     // 將加點白飯的費用加到主餐價格上
     setMealPrice += extraRice.price * extraRice.quantity;
  }
  
  // 建立一個結構完整的套餐物件
  const mealPackage = {
      ...props.setMeal,
      price: setMealPrice, // 更新後的套餐總價
      subItems: subItems,  // 附餐陣列
      quantity: 1
  };

  emit('confirm', mealPackage);
  cancel();
}

</script>

<style scoped>
/* --- Base --- */
.modal-overlay { 
    position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
    background-color: rgba(0, 0, 0, 0.7); 
    display: flex; justify-content: center; align-items: center; 
    z-index: 1000; font-family: 'Helvetica Neue', Arial, sans-serif; 
}
.modal-content { background-color: white; padding: 24px 32px; border-radius: 16px; width: 90%; max-width: 480px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.title { font-size: 22px; font-weight: 700; color: #333; }
.close-btn { background: none; border: none; font-size: 32px; font-weight: 300; color: #888; cursor: pointer; line-height: 1; }
.description { font-size: 15px; color: #666; margin-bottom: 24px; }
.selection-group { margin-bottom: 24px; }
.group-title { font-size: 18px; font-weight: 600; color: #333; margin-bottom: 16px; }

/* --- Radio Buttons --- */
.radio-group label { display: flex; align-items: center; margin-bottom: 12px; cursor: pointer; font-size: 16px; }
.radio-group input[type="radio"] { display: none; }
.radio-custom { width: 20px; height: 20px; border: 2px solid #ccc; border-radius: 50%; margin-right: 12px; display: inline-block; position: relative; transition: border-color 0.2s; }
.radio-group label.active .radio-custom { border-color: #ff4d4f; }
.radio-group label.active .radio-custom::after { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 10px; height: 10px; background-color: #ff4d4f; border-radius: 50%; }

/* --- Custom Dropdown --- */
.custom-dropdown-wrapper { position: relative; width: 95%; }
.dropdown-trigger { 
    width: 100%; padding: 12px 16px; border: 1px solid #ddd; 
    border-radius: 8px; background-color: #fff; font-size: 16px; 
    cursor: pointer; display: flex; justify-content: space-between; align-items: center; 
}
.dropdown-trigger .arrow { 
    width: 0; height: 0; border-left: 6px solid transparent; 
    border-right: 6px solid transparent; border-top: 6px solid #333; 
    transition: transform 0.2s ease; 
}
.dropdown-trigger .arrow.open { transform: rotate(180deg); }

.dropdown-options { 
    list-style: none; padding: 0; margin: 4px 0 0 0; 
    position: absolute; top: 100%; left: 0; right: 0; 
    background-color: white; border: 1px solid #ddd; 
    border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); 
    z-index: 10; max-height: 170px; /* Reduced height */
    overflow-y: auto; 
}
.dropdown-options li { padding: 12px 16px; cursor: pointer; display: flex; align-items: center; }
.dropdown-options li:hover { background-color: #f5f5f5; }
.dropdown-options li.selected { background-color: #c53030; color: white; }
.dropdown-options li .checkmark { font-weight: bold; margin-right: 8px; }

/* --- Counter --- */
.counter { display: flex; align-items: center; gap: 16px; }
.counter button { width: 36px; height: 36px; border-radius: 50%; border: 1px solid #ddd; background-color: #f8f8f8; font-size: 20px; font-weight: bold; color: #555; cursor: pointer; transition: background-color 0.2s; }
.counter button:hover { background-color: #eee; }
.counter span { font-size: 20px; font-weight: 600; min-width: 30px; text-align: center; }

/* --- Actions --- */
.modal-actions { display: flex; justify-content: flex-end; align-items: center; margin-top: 32px; gap: 12px; }
.btn-cancel { background: none; border: none; font-size: 16px; font-weight: 600; color: #888; padding: 12px 16px; cursor: pointer; }
.btn-confirm { background-color: #ff4d4f; border: none; color: white; font-size: 16px; font-weight: 600; padding: 12px 24px; border-radius: 8px; cursor: pointer; transition: background-color 0.2s; }
.btn-confirm:hover { background-color: #e63946; }
</style>
