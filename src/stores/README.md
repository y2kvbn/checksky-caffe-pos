# ① 目的
本資料夾存放所有 Pinia stores，作為整個應用程式的狀態管理中心。每個 store 檔案都代表一個特定的資料領域（例如菜單、訂單、設定等）。

## ② 結構與命名規範
- **檔案命名**: 使用小寫駝峰式命名，並以 `.ts` 結尾，例如 `useMenuStore.ts`。Store 的名稱應與其管理的資料領域相對應。
- **匯入/輸出約定**:
  - Stores 應使用 Pinia 的 `defineStore` 函式來定義。
  - 優先使用 `setup` store (函式式) 風格。
  - 匯出 store 本身，以便在元件中使用。
  - 使用 `@/stores/...` 的別名來匯入 stores。
- **不得事項**:
  - 不應在 store 檔案中執行任何與狀態管理無關的邏輯。
  - 避免在 store 之間產生循環依賴。

## ③ 依賴與界面
- **相依套件**: `pinia`, `vue`
- **對外介面**: 每個 store 透過 `state`, `getters`, 和 `actions` 提供其對外介面。
  - `state`: 應使用 `ref` 或 `reactive` 創建。
  - `getters`: 應使用 `computed` 屬性創建。
  - `actions`: 為普通函式，用於修改 state。
- **使用的 Token / i18n key**: 無。

## ④ 變更紀錄（由 Gemini 追加；一改一記）

- **[修改][v1.0]**
  **動作**: 合併 `menu.js` 的功能至 `menu.ts`，並刪除前者。
  **原因**: 統一採用 TypeScript (`.ts`) 並使用功能更完整的版本，增加了本地儲存和更清晰的型別定義。
  **影響檔案**: `src/stores/menu.ts`, `src/stores/menu.js`
  **驗證**: 終端機成功

- **[修改][v1.0]**
  **動作**: 刪除功能較弱的 `orders.js`，保留 `orders.ts`。
  **原因**: `orders.ts` 提供了更完善的功能，包括本地儲存、更 robust 的 ID 生成以及更詳細的 TypeScript 型別。
  **影響檔案**: `src/stores/orders.js`
  **驗證**: 終端機成功

- **[修改][v1.0]**
  **動作**: 將 `promotions.js` 的 `singleItemDeal` 功能合併至 `promotions.ts`，並刪除前者。
  **原因**: 統一採用 TypeScript，並將所有優惠活動邏輯集中到單一、結構更優的 store 中。
  **影響檔案**: `src/stores/promotions.ts`, `src/stores/promotions.js`
  **驗證**: 終端機成功

- **[修改][v1.0]**
  **動作**: 刪除功能較弱的 `reservations.js`，保留 `reservations.ts`。
  **原因**: `reservations.ts` 提供了本地持久化、ID 查找、以及更健壯的資料驗證邏輯。
  **影響檔案**: `src/stores/reservations.js`
  **驗證**: 終端機成功

- **[修改][v1.0]**
  **動作**: 刪除功能較弱的 `settings.js`，保留 `settings.ts`。
  **原因**: `settings.ts` 增加了本地持久化和重設功能。
  **影響檔案**: `src/stores/settings.js`
  **驗證**: 終端機成功
