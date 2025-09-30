# ① 目的
本資料夾存放應用程式的所有路由設定。`index.ts` 是唯一的路由設定檔，它定義了所有的 URL 路徑、對應的元件、以及路由守衛（用於身份驗證等）。

## ② 結構與命名規範
- **檔案命名**: 路由設定檔應命名為 `index.ts`。
- **匯入/輸出約定**:
  - 使用 `vue-router` 的 `createRouter` 和 `createWebHistory` 函式來建立路由實例。
  - 路由陣列的型別應為 `Array<RouteRecordRaw>`。
  - 延遲載入 (Lazy load) 元件以提升效能，例如 `component: () => import('../components/Dashboard.vue')`。
  - 匯出 `router` 實例，供 `main.ts` 使用。
- **不得事項**:
  - 不應在路由檔案中包含非路由相關的邏輯。

## ③ 依賴與界面
- **相依套件**: `vue-router`, `pinia`
- **對外介面**: 匯出一個 `router` 實例，其中包含了所有已定義的路由。
- **使用的 Token / i18n key**: 無。

## ④ 變更紀錄（由 Gemini 追加；一改一記）

- **[修改][v1.0]**
  **動作**: 修正了 `router` 與 `main.ts` 之間的循環依賴問題。
  **原因**: 原始設計中 `main.ts` 匯入 `router`，而 `router` 為了存取 Pinia store 又匯入 `main.ts`，造成了不穩定的循環依賴。我透過建立一個獨立的 `src/stores/index.ts` 來初始化並匯出 Pinia 實例，讓 `main.ts` 和 `router/index.ts` 都從此處匯入，從而打破了循環。
  **影響檔案**: `src/router/index.ts`, `src/main.ts`, `src/stores/index.ts`
  **驗證**: 終端機成功
