<template>
  <div class="settings-card">
    <h3><i class="fas fa-history"></i> 登入管理</h3>
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
</template>

<script setup lang="ts">
</script>

<style scoped>
.settings-card {
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  padding: 25px;
  margin-bottom: 25px;
}

.settings-card h3 {
  font-size: 20px;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #333;
}

.settings-card p {
  margin: 0 0 20px 0;
  color: #666;
  line-height: 1.5;
}

.login-history table {
  width: 100%;
  border-collapse: collapse;
}

.login-history th,
.login-history td {
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
</style>
