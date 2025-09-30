<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h3>本日結算報告</h3>
        <button @click="close" class="close-btn">&times;</button>
      </div>
      <div class="modal-body" id="settlement-report">
        <p class="report-date">日期: {{ new Date(settlement.date).toLocaleDateString() }}</p>
        
        <div class="summary-grid">
          <div class="summary-card total-revenue">
            <h4>已結帳總額</h4>
            <p>NT$ {{ settlement.totalRevenue }}</p>
          </div>
          <div class="summary-card pending-total">
            <h4>未結帳總額</h4>
            <p>NT$ {{ settlement.pendingTotal }}</p>
          </div>
        </div>

        <div class="summary-card total-orders">
          <h4>總訂單數</h4>
          <p>{{ settlement.totalOrders }} 筆</p>
        </div>

        <h4>結算金額入帳方式</h4>
        <div class="payment-details">
          <div class="payment-method">
            <span><i class="fas fa-money-bill-wave"></i> 現金</span>
            <strong>NT$ {{ settlement.cashTotal }}</strong>
          </div>
          <div class="payment-method">
            <span><i class="fab fa-line"></i> LinePay</span>
            <strong>NT$ {{ settlement.linePayTotal }}</strong>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button @click="close" class="btn btn-grey">關閉</button>
        <button @click="$emit('download-image')" class="btn btn-secondary"><i class="fas fa-camera-retro"></i> 下載為圖片</button>
        <button @click="$emit('archive-and-clear')" class="btn btn-success"><i class="fas fa-archive"></i> 納入營收分析</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface SettlementData {
  date: string;
  totalRevenue: number;
  totalOrders: number;
  cashTotal: number;
  linePayTotal: number;
  pendingTotal: number; // 新增未結帳總額
}

defineProps<{ 
  visible: boolean;
  settlement: SettlementData;
}>();

const emit = defineEmits(['close', 'download-image', 'archive-and-clear']);

const close = () => {
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.65);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000; animation: fadeIn 0.3s ease-out;
}

.modal-content { 
  background: #fdfdfd; border-radius: 18px;
  box-shadow: 0 12px 35px rgba(0,0,0,0.25); 
  width: 450px; overflow: hidden; 
}

.modal-header { 
  padding: 20px 25px; background: #f7f7f7; 
  border-bottom: 1px solid #eee; display: flex; 
  justify-content: space-between; align-items: center; 
}
.modal-header h3 { margin: 0; font-size: 22px; font-weight: 600; }
.close-btn { background: none; border: none; font-size: 28px; cursor: pointer; color: #999; }

.modal-body { padding: 25px; text-align: center; }
.report-date { font-size: 14px; color: #888; margin-bottom: 20px; }

.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 15px;
}

.summary-card { 
  padding: 20px; border-radius: 12px; 
  color: white; text-shadow: 1px 1px 2px rgba(0,0,0,0.1); 
}
.summary-card h4 { margin: 0 0 8px 0; font-size: 16px; opacity: 0.9; }
.summary-card p { margin: 0; font-size: 28px; font-weight: bold; }

.total-revenue { background: linear-gradient(135deg, #4facfe, #00f2fe); }
.pending-total { background: linear-gradient(135deg, #ffc371, #ff5f6d); }
.total-orders { background: linear-gradient(135deg, #667eea, #764ba2); margin-bottom: 15px; }

.modal-body > h4 { 
  margin-top: 25px; margin-bottom: 15px; 
  font-size: 18px; color: #444; text-align: left; font-weight: 600; 
}

.payment-details { 
  display: flex; flex-direction: column; 
  gap: 12px; text-align: left; 
}
.payment-method { 
  display: flex; justify-content: space-between; align-items: center; 
  padding: 15px; background: #f5f8fa; 
  border-radius: 10px; font-size: 16px; 
  border: 1px solid #eef;
}
.payment-method span { display: flex; align-items: center; gap: 10px; color: #555; }
.payment-method strong { color: #333; font-size: 18px; font-weight: 600;}

.modal-footer { 
  padding: 20px 25px; background: #f7f7f7; 
  border-top: 1px solid #eee; display: flex; 
  justify-content: flex-end; gap: 12px; 
}

.btn { 
  display: flex; align-items: center; gap: 8px; 
  font-weight: bold; border-radius: 10px; cursor: pointer; 
  transition: all 0.3s ease; border: none; padding: 12px 22px; 
  font-size: 14px;
}

.btn-grey { background-color: #adb5bd; color: #fff; }
.btn-secondary { background-color: #6c757d; color: #fff; }
.btn-success { background-color: #28a745; color: #fff; }

@keyframes fadeIn { 
  from { opacity: 0; transform: translateY(-10px) scale(0.98); } 
  to { opacity: 1; transform: translateY(0) scale(1); } 
}
</style>