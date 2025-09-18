# 專案規格說明 (SPEC.md)

## 1. 專案概述

本專案是一個專為「向天泓咖啡廳」設計的現代化 POS (Point of Sale) 前後台管理系統。系統旨在提供一個全面的數位化解決方案，用於處理日常的店務操作，包括點餐、訂單管理、桌號設定、菜單維護、營收追蹤以及客戶訂位等。

**技術棧:**
*   **前端框架:** Vue.js 3
*   **開發工具:** Vite
*   **狀態管理:** Pinia
*   **語言:** JavaScript

## 2. 主要功能模組

系統由以下幾個核心功能模組構成，每個模組對應一個主要的畫面或功能區塊。

### 2.1. 登入 (Login)
*   **對應元件:** `src/componen/Login.vue`
*   **功能描述:** 提供使用者（店家員工）登入系統的驗證介面。是進入後台管理系統的入口。

### 2.2. 儀表板 (Dashboard)
*   **對應元件:** `src/componen/Dashboard.vue`
*   **功能描述:** 這是登入後的主畫面框架。它包含一個位於左側的側邊導覽欄和一個右側的內容顯示區。使用者可以透過點擊側邊欄的連結，在內容區動態載入不同的管理功能頁面。

### 2.3. 即時訂單總覽 (Dashboard Home)
*   **對應元件:** `src/componen/DashboardHome.vue`
*   **功能描述:** 儀表板的預設首頁，提供店家營運狀況的即時快照。
    *   **數據指標卡:** 顯示「已結帳總額」、「未結帳金額」、「總訂單數」等關鍵數據。
    *   **即時訂單牆:** 以卡片形式展示目前所有的訂單，並根據訂單狀態（如：處理中、已完成、已取消）使用不同顏色標示，方便店家快速掌握。
    *   **訂單操作:** 在訂單卡片上，可以直接進行「完成」、「取消」、「恢復」、「列印收據」等操作。
    *   **快捷按鈕:** 提供「前往點餐」和「每日結算」的快速入口。

### 2.4. 點餐系統 (Point of Sale - POS)
*   **對應元件:** `src/componen/PointOfSale.vue`
*   **功能描述:** 模擬真實點餐機的操作介面，供店員為客人建立新訂單。

### 2.5. 菜單管理 (Menu Management)
*   **對應元件:** `src/componen/MenuManagement.vue`
*   **功能描述:** 允許管理者新增、編輯、刪除或調整菜單上的品項，包括設定價格、分類和圖片。

### 2.6. 桌號管理 (Table Management)
*   **對應元件:** `src/componen/TableManagement.vue`
*   **功能描述:** 用於設定店內的桌位資訊，例如桌號名稱、容納人數等。

### 2.7. 營收分析 (Revenue Analysis)
*   **對應元件:** `src/componen/RevenueAnalysis.vue`
*   **功能描述:** 提供視覺化的圖表和數據報告，幫助店家分析營業收入、熱銷品項、不同時段的業績等，以作為商業決策的依據。

### 2.8. 優惠活動 (Promotions)
*   **對應元件:** `src/componen/Promotions.vue` & `src/componen/PromotionManagement.vue`
*   **功能描述:** 用於建立和管理店家的促銷活動，例如季節限定優惠、折扣碼等。

### 2.9. 訂位管理 (Reservation Management)
*   **對應元件:** `src/componen/ReservationManagement.vue`
*   **功能描述:** 提供一個介面來管理顧客的訂位需求，包括查看、新增或取消訂位。

### 2.10. 系統設定 (System Settings)
*   **對應元件:** `src/componen/SystemSettings.vue`
*   **功能描述:** 用於設定系統級的參數，例如店鋪基本資訊、稅率、支付方式等。

## 3. 輔助畫面元件

這些元件通常以彈出視窗 (Modal) 或嵌入式元件的形式出現，以輔助主要功能的完成。

*   **`PrintReceipt.vue`:** 用於生成並預覽待列印的顧客收據樣式。
*   **`SelectTableModal.vue`:** 在點餐或訂位時，提供一個選擇桌號的彈出視窗。
*   **`SetMealModal.vue`:** 如果菜單中有套餐，此元件可能用於讓顧客自訂套餐內容。
*   **`NotFound.vue`:** 當使用者訪問一個不存在的路徑時，顯示 404 錯誤頁面。

## 4. 狀態管理 (State Management)

*   **使用工具:** Pinia (`src/stores/*.js`)
*   **描述:** 專案採用 Pinia 來集中管理整個應用的共享狀態。從 `src/stores` 目錄結構來看，開發者為每個主要的功能模組都建立了獨立的 Store，這是一個良好的實踐，有助於保持程式碼的組織性和可維護性。
    *   `auth.js`: 管理使用者驗證狀態。
    *   `menu.js`: 管理菜單數據。
    *   `orders.js`: 管理訂單數據。
    *   `promotions.js`: 管理優惠活動數據。
    *   `reservations.js`: 管理訂位數據。
    *   `settings.js`: 管理系統設定。
    *   `tables.js`: 管理桌號數據。

## 5. 路由 (Routing)

*   **設定檔:** `src/router/index.js`
*   **描述:** 路由設定檔負責定義 URL 路徑與上述主要畫面元件之間的對應關係，實現單頁應用 (SPA) 的頁面切換功能。
