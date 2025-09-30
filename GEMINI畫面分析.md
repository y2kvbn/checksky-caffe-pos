
**專案**：向天泓咖啡廳 POS 系統
**版本**：v1.0 (逆向分析)
**技術**：Vue 3 `<script setup>` / Pinia / Vue Router / Vite
**UI 工具**：(未使用特定 UI 框架)

---

### 1) 全域設計系統（必填、數值化）
- **版心/間距**
  - 版心寬：［未明確定義，內容為流式佈局］
  - 左右安全邊距：［未明確定義］
  - 間距刻度：［未明確定義］
- **斷點（RWD）**
  - lg：≥［1280］ (推斷)
  - md：［960–1279］ (推斷)
  - sm：<［960］ (推斷)
- **色彩（HEX）** (來自 `:root`)
  - 主色 (primary-color):［#f56565］
  - 次色 (secondary-color):［#f6ad55］
  - 字色深 (text-dark):［#2c3e50］
  - 字色淺 (text-light):［#555555］
  - 邊框 (border-color):［#eeeeee］
  - 背景 (tertiary-color):［#ffffff］
  - 陰影 (shadow):［0 10px 25px rgba(0, 0, 0, 0.1)］
- **字體/字級**
  - 字族：［-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif］
  - 字級：［未統一定義］
- **按鈕樣式**
  - ［未統一定義］
- **樣式檔**
  - `-- [編輯SCSS]` 檔名/路徑：［src/style.css］

---

### 2) Page：路由頁面分析
> 根據 `src/router/index.ts` 分析

| 頁面名稱 | 檔案 | 路徑 | 功能 |
|---|---|---|---|
| Login | Login.vue | `/` | 使用者登入頁面 |
| DashboardHome | DashboardHome.vue | `/dashboard/home` | 儀表板首頁 |
| PointOfSale | PointOfSale.vue | `/dashboard/pos` | POS 點餐系統 |
| MenuManagement | MenuManagement.vue | `/dashboard/menu` | 菜單管理 |
| ReservationManagement | ReservationManagement.vue | `/dashboard/reservations` | 預約管理 |
| RevenueAnalysis | RevenueAnalysis.vue | `/dashboard/revenue` | 營收分析 |
| PromotionManagement | PromotionManagement.vue | `/dashboard/promotions` | 促銷活動管理 |
| SystemSettings | SystemSettings.vue | `/dashboard/settings` | 系統設定 |
| NotFound | NotFound.vue | `/:pathMatch(.*)*` | 404 未找到頁面 |

---

### 3) Layouts：`/src/components/Dashboard.vue`
- **功能**：應用程式主佈局，包含側邊導覽列和主內容顯示區。
- **尺寸**：側邊欄寬度約 250px (推斷)，主內容區為剩餘空間。
- **RWD**：［未明確設計 RWD］
- **顏色**：背景主要為 `#f8f9fa`，側邊欄背景為 `#ffffff`。
- **互動**：點擊側邊欄項目可切換右側的 `<router-view>` 內容。

---

### 4) Components（必填：Props/Emits 清楚）
> 置於 `/src/components`。此為初步分析，詳細 Props/Emits 需進一步檢視各檔案。

| 元件 | 路徑 | 職責 | 結構概要 | Props | Emits |
|---|---|---|---|---|---|
| Dashboard | /components/Dashboard.vue | 主要儀表板佈局 | 側邊欄 + 內容區 | - | - |
| DashboardHome | /components/DashboardHome.vue | 儀表板首頁內容 | 歡迎訊息、統計卡片 | - | - |
| Login | /components/Login.vue | 登入表單 | 輸入框、登入按鈕 | - | `login-success` (推斷) |
| MenuManagement | /components/MenuManagement.vue | 菜單管理介面 | 菜單列表、新增/編輯按鈕 | - | - |
| NotFound | /components/NotFound.vue | 404 頁面 | 錯誤訊息、返回連結 | - | - |
| PointOfSale | /components/PointOfSale.vue | POS 介面 | 菜單、購物車、結帳 | - | - |
| PrintReceipt | /components/PrintReceipt.vue | 收據列印 | 收據格式 | `order:Object` | - |
| Promotion... | /components/PromotionManagement.vue | 促銷管理介面 | 促銷活動列表 | - | - |
| ... (其餘元件待分析) | ... | ... | ... | ... | ... |

**樣式強制補充**
- ［大部分樣式為元件內 Scope CSS，缺乏全域性設計。］

---

### 5) 資產/圖像
- public/vite.svg
- src/assets/vue.svg

---

### 6) 驗收清單（硬性）
- [ ] 程式碼已整理，但功能與版面未變更。
- [ ] 已統一使用 TypeScript (`.ts`)。
- [ ] 元件命名符合 PascalCase。
- [ ] 已建立 `GEMINI畫面分析.md`。

---

## 執行計畫

1. **檔案類型統一**：將 `stores` 目錄下的 `.js` 檔案轉換為 `.ts`，並刪除無用的 `main.js`，確保專案一致性。
2. **詳細元件分析**：逐一讀取 `/src/components/` 下所有 Vue 元件，完成上方 Components 表格的 Props 和 Emits 分析。
3. **程式碼整理**：檢查是否有可應用的全域樣式重構機會，並根據分析結果微調程式碼結構，但不改變外觀與行為。
4. **最終驗收**：核對驗收清單，確保所有整理工作均符合規範且未引入新問題。

