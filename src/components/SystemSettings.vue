<template>
  <div class="system-settings">
    <h2>系統設定</h2>

    <!-- 登入管理 -->
    <div class="settings-card">
      <h3>登入管理</h3>
      <p>查詢最近的登入活動紀錄。</p>
      <div class="login-history">
        <table>
          <thead>
            <tr>
              <th>日期</th>
              <th>使用者</th>
              <th>IP位址</th>
              <th>狀態</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2024-07-28 10:30</td>
              <td>Checksky</td>
              <td>192.168.1.1</td>
              <td class="status-success">成功</td>
            </tr>
            <tr>
              <td>2024-07-27 18:45</td>
              <td>Checksky</td>
              <td>192.168.1.1</td>
              <td class="status-success">成功</td>
            </tr>
             <tr>
              <td>2024-07-27 09:12</td>
              <td>admin</td>
              <td>10.0.0.5</td>
              <td class="status-fail">失敗</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 收據備註文字 -->
    <div class="settings-card">
        <h3>收據備註文字</h3>
        <p>顯示於訂單收據最下方的文字欄位。</p>
        <textarea v-model="receiptNotes" rows="3"></textarea>
    </div>

    <!-- 程式版本與客服 -->
    <div class="settings-card">
        <h3>關於</h3>
        <div class="about-section">
            <div class="about-item">
                <strong>程式版本:</strong>
                <span>1.0.0</span>
            </div>
             <div class="about-item">
                <strong>客服聯繫方式:</strong>
                <span>永泓股份有限公司 (service@checksky.com.tw)</span>
            </div>
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';

const receiptNotes = ref('沒有一來就有好吃的啦！請耐心等候^＿^ ');

</script>

<style scoped>
.system-settings h2 {
  font-size: 28px;
  margin-bottom: 25px;
  color: #333;
}

.settings-card {
    background-color: #fff;
    border-radius: 15px;
    box-shadow: 0 8px 16px rgba(0,0,0,0.08);
    padding: 25px;
    margin-bottom: 25px;
}

.settings-card h3 {
    font-size: 20px;
    margin: 0 0 10px 0;
}

.settings-card p {
    margin: 0 0 15px 0;
    color: #666;
}

.login-history table {
    width: 100%;
    border-collapse: collapse;
}

.login-history th, .login-history td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #f0f0f0;
}

.login-history th {
    background-color: #f9f9f9;
    font-weight: 600;
}

.status-success {
    color: #28a745;
    font-weight: bold;
}

.status-fail {
    color: #dc3545;
    font-weight: bold;
}

textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    resize: vertical;
}

.about-section {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.about-item {
    display: flex;
    gap: 10px;
}

.about-item strong {
    color: #333;
}

</style>
