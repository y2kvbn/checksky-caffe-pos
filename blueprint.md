# blueprint.md（任務清單）

---

### 總覽

本專案為一個 Point-of-Sale (POS) 系統的前端應用，使用 Vue.js、TypeScript、Vite 和 Pinia 建立。旨在提供一個現代化、高效且易於維護的界面，用於管理餐廳的各個方面，包括菜單、訂單、預約、促銷和系統設定。

### 風格與設計

本專案將遵循現代化的設計原則，注重使用者體驗和視覺吸引力。

*   **排版**: 使用清晰、易讀的字體，並透過大小和粗細的對比來組織資訊層次。
*   **色彩**: 採用乾淨、專業的色盤，並策略性地使用強調色來引導使用者的注意力。
*   **佈局**: 響應式佈局，確保在桌面和行動裝置上都能提供最佳體驗。
*   **元件**: 使用圓角、陰影和過渡效果，創造一個有深度且具互動性的介面。

### 功能

*   **身份驗證**: 使用者登入和登出。
*   **儀表板**: 顯示關鍵指標和快速導航。
*   **POS**: 處理客戶訂單。
*   **菜單管理**: 新增、編輯和刪除菜單項目。
*   **預約管理**: 管理客戶預約。
*   **營收分析**: 視覺化銷售數據。
*   **促銷管理**: 建立和管理促銷活動。
*   **系統設定**: 配置應用程式設定。

---

### 任務 1：程式碼基礎整理與 TypeScript 統一

1.  **目標**：
    將專案中的 `.js` 檔案完全轉換為 `.ts`，統一程式碼風格與結構，並建立必要的紀錄文件，但不更動任何既有功能與畫面。

2.  **執行步驟**：
    *   [x] **步驟 1**: 統一 Pinia stores 為 TypeScript。
        *   [x] 合併 `menu.js` 至 `menu.ts`。
        *   [x] 刪除 `menu.js`。
        *   [x] 刪除 `orders.js`。
        *   [x] 合併 `promotions.js` 至 `promotions.ts`。
        *   [x] 刪除 `promotions.js`。
        *   [x] 合併 `reservations.js` 至 `reservations.ts`。
        *   [x] 刪除 `reservations.js`。
        *   [x] 合併 `settings.js` 至 `settings.ts`。
        *   [x] 刪除 `settings.js`。
        *   [x] 建立 `src/stores/README.md` 並記錄變更。
    *   [x] **步驟 2**: 整理入口檔案與路由。
        *   [x] 移除 `main.js`，以 `main.ts` 為主。
        *   [x] 修正 `router/index.ts` 的循環依賴問題。
        *   [x] 驗證 `router/index.ts` 的元件路徑。
        *   [x] 建立 `src/router/README.md` 並記錄變更。
    *   [x] **步驟 3**: 整理 `components` 資料夾。
        *   [x] 合併 `Promotions.vue` 至 `PromotionManagement.vue`。
        *   [x] 刪除 `Promotions.vue`。

---

### 任務 2：元件重構與樣式改進

1.  **目標**：
    對現有元件進行重構，改善其結構、可讀性和樣式，使其更符合現代化的設計標準。

2.  **執行步驟**：
    *   [x] **步驟 1**: 重構 `Login.vue`。
        *   [x] 建立 `auth.ts` Pinia store 來管理身份驗證狀態。
        *   [x] 將 `Login.vue` 的不同視圖（登入、忘記密碼、驗證碼、重設密碼）拆分為獨立的子元件 (`LoginForm.vue`, `ForgotPasswordForm.vue`, `VerifyCodeForm.vue`, `ResetPasswordForm.vue`)。
        *   [x] 將 `Login.vue` 重構為一個控制器，使用動態元件 `<component :is="...">` 來管理不同的視圖。
        *   [x] 將所有相關元件轉換為 TypeScript。
    *   [x] **步驟 2**: 重構 `Dashboard.vue`。
        *   [x] 建立 `DashboardHeader.vue` 和 `DashboardSidebar.vue` 子元件。
        *   [x] 將 `Dashboard.vue` 重構為一個佈局管理器，並將 header 和 sidebar 的內容移至其各自的元件中。
        *   [x] 將所有相關元件轉換為 TypeScript。
    *   [x] **步驟 3**: 重構 `DashboardHome.vue`。
        *   [x] 建立 `DashboardHomeHeader.vue`, `DashboardMetrics.vue`, 和 `OrderCard.vue` 子元件。
        *   [x] 將 `DashboardHome.vue` 重構為一個佈局管理器，並將其內容拆分到各自的子元件中。
        *   [x] 將所有相關元件轉換為 TypeScript。
    *   [x] **步驟 4**: 重構 `PointOfSale.vue`。
        *   [x] 建立 `PosHeader.vue`, `CategorySidebar.vue`, `MenuItemCard.vue` 和 `CartSidebar.vue` 子元件。
        *   [x] 將 `PointOfSale.vue` 重構為一個佈局管理器，並將其內容拆分到各自的子元件中。
        *   [x] 將所有相關元件轉換為 TypeScript。
    *   [x] **步驟 5**: 重構 `MenuManagement.vue`。
        *   [x] 建立 `CategoryManagementPanel.vue` 和 `MenuItemsPanel.vue` 子元件。
        *   [x] 將 `MenuManagement.vue` 重構為一個佈局管理器，並將其內容拆分到各自的子元件中。
        *   [x] 將所有相關元件轉換為 TypeScript。
    *   [x] **步驟 6**: 重構 `ReservationManagement.vue`。
        *   [x] 建立 `ReservationHeader.vue`, `CalendarPanel.vue`, `TimelinePanel.vue` 和 `ReservationModal.vue` 子元件。
        *   [x] 將 `ReservationManagement.vue` 重構為一個佈局管理器，並將其內容拆分到各自的子元件中。
        *   [x] 將所有相關元件轉換為 TypeScript。
    *   [x] **步驟 7**: 重構 `RevenueAnalysis.vue`。
        *   [x] 建立 `RevenueChart.vue`, `RevenueStats.vue`, 和 `TopItemsList.vue` 子元件。
        *   [x] 將 `RevenueAnalysis.vue` 重構為一個佈局管理器，並將其內容拆分到各自的子元件中。
        *   [x] 將所有相關元件轉換為 TypeScript。
    *   [x] **步驟 8**: 重構 `SystemSettings.vue`。
        *   [x] 建立 `ReceiptNotesSettings.vue`, `LoginManagement.vue`, 和 `AboutSection.vue` 子元件。
        *   [x] 將 `SystemSettings.vue` 重構為一個佈局管理器，並將其內容拆分到各自的子元件中。
        *   [x] 將所有相關元件轉換為 TypeScript。
