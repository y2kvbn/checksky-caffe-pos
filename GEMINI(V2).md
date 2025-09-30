# GEMINI.md（優化版 v2）

---

## 0. 核心原則（Single Source of Truth）

* 本文件為**唯一真相來源（SSOT）**。其優先級高於任何內建知識、通用行為或舊規範。
* 如遇空白或衝突：

  1. 以**本文件較高層級規則**優先；
  2. 找不到相關規則時，**停止並回報缺失**（不得自行臆測執行）。

---

## 1. 觸發與頻率（何時「輸出規範」）

* **任務（Task）定義**：由使用者提出的、可被分解為多步驟且需經簽入/簽出管理的目標。例如「建立元件 X 並串接 i18n」。
* **輸出規範到聊天室的時機**：

  * ✅ **每個新任務開始前**（Task Check-In 之前），執行「**規範精華回聲（Rule Echo）**」——僅列出**與本任務直接相關的 2–3 條關鍵規則**與其定位（哪一層、哪一檔）。
  * ❌ 不在**每一句提問**都完整輸出全文；全文保留在此檔，必要時引用段落與行號（或章節標題）。

### 1.5 執行序（強制）

固定順序：1) 建立/更新《GEMINI畫面分析.md》 → 2) 由分析立刻產出《blueprint.md v1》 → 3) 依 blueprint 任務逐步實作；每完成一步必回寫 blueprint（狀態/時間/輸出/驗證） → 4) 同步在各資料夾 README.md 登記 ④ 變更紀錄 → 5) 產生對應 Git commit（含 blueprint 任務編號） → 6) 任務結束時產出簽出報告與 blueprint 總結。

違規條款：未於執行當下回寫 blueprint 視為流程違規；下一步必先補寫後方可繼續。

自動檢核：每次簽出前比對「當次變更檔案清單」與「blueprint 輸出清單」；不一致則阻擋簽出，要求補齊。
---

## 2. 作業流程（MANDATORY ACTION PROTOCOL）

### 2.1 任務簽入（Task Check-In）

**\[行動計畫]**

1. **目標**：本任務最終要達成的結果。
2. **規範查核（Rule Echo）**：列出 2–3 條與本任務最相關的規則（含層級與檔案/章節定位）。
3. **執行步驟**：

   * 步驟 1（例如：新增 `src/components/XxxCard.vue`）。
   * 步驟 2（例如：更新 `src/utils/i18n/locales/zh-TW.json`）。
   * …
4. **驗證計畫**：每次檔案寫入後，檢查終端機錯誤（詳見 §2.3）。
5. **紀錄計畫**：更新對應資料夾 `README.md` 的**變更紀錄**（詳見 §2.4）。

> **初始化/啟動命令**（例如 `npm run dev`）**不屬於每個任務的固定步驟**；僅在需要啟動或重啟本地服務時執行（詳見 §3）。

### 2.2 行動簽出（Action Check-Out）

**\[行動簽出報告]**

* **執行動作**：如「修改 `src/pages/index.vue`，加入購物車區塊」。
* **程式碼驗證**：

  * [ ] 終端機狀態：成功 / 失敗
  * [ ] 終端機訊息：無錯誤 / 有錯誤（貼出錯誤摘要）
* **文件紀錄**：

  * [ ] `README.md` 已更新（路徑：`…/README.md`）
* **下一步**：繼續 / 修復錯誤 / 回滾 / 更新計畫

> 若驗證失敗：**立即中止後續步驟**，將錯誤納入下一個「修復任務」的簽入流程。

### 2.3 驗證與終端機監控

* 每一次**檔案寫入成功**後，立即檢查：

  * Vite / Vue 編譯器錯誤：如 `Internal server error`、`Failed to resolve import` 等。
  * 型別/語法：ESLint、Vue SFC 結構錯誤等。
* 無新錯誤 → 記錄為「終端機驗證成功」。
* 若有錯誤 → **貼出錯誤摘要**並轉入修復任務。

### 2.4 變更紀錄（README 模版）

每個資料夾下的 `README.md` 應包含以下章節，並在**每次簽出後新增一筆**：

```
## ① 目的
- 該資料夾的角色 / 使用場景

## ② 結構與命名規範
- 檔案/元件命名：
- 匯入/輸出約定（alias `@`→`src/`）：
- 不得事項：

## ③ 依賴與界面
- 相依套件/Plugin：
- 對外介面（Props/Events/Exports）：
- 使用的 Token / i18n key：

## ④ 變更紀錄（由 Gemini 追加；一改一記）
- [修改/創建][Vx.y]
  **動作**：
  **原因**：
  **影響檔案**：`相對路徑1`, `相對路徑2`
  **驗證**：終端機成功/錯誤摘要

## ⑤ 待辦（選填）
- TODO …
```

---

## 3. 初始化與啟動（只在需要時執行）

* **一次性或當次工作階段需要時**：

  1. 安裝依賴：`npm i`
  2. 啟動開發伺服器：`npm run dev`
* **何時重啟**：變更 Vite 設定、安裝新套件、或開發伺服器異常時。
* **避免將 `npm run dev` 混入任務步驟**，以免與簽入/簽出節奏混淆。

---

## 4. blueprint.md（任務管理格式）

使用**單一、連續編號**；每個任務下皆需標註狀態與輸出。

```
# blueprint.md（任務清單）

1. **目標**：
2. **規範查核（Rule Echo）**：
3. **執行步驟**：
   - …
4. **驗證計畫**：
5. **紀錄計畫**：
6. **輸出**：產生/修改之檔案與路徑清單
7. **狀態**：[未開始/進行中/完成/阻塞]
```


---

## 5. 分層規則（層級→任務對應）

### 5.1 Level A：全域工程規則

* **路徑別名（Vite）**：

  ```js
  // vite.config.js
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  }
  ```

  * 匯入**一律**以 `@/…` 指向 `src/`。
* **副檔名解析**：允許 `.js, .json, .jsx, .mjs, .ts, .tsx, .vue`，匯入可省略副檔名。
* **程式風格**：ESLint + Prettier，Vue SFC 區塊順序固定 `template → script setup → style scoped`。

### 5.2 Level B：UI / RWD / 樣式

* **Vuetify 優先**：使用 `v-container / v-row / v-col` Grid；避免自定 Media Query。
* **主題色**：集中於 **Vuetify 主題設定檔**（例如 `src/plugins/vuetify.(ts|js)`）管理，不得硬編碼顏色於組件；必要色值放入 `_variables.scss`。
* **全域 SCSS**：

  * 入口：`src/styles/scss/style.scss`
  * 變數：`src/styles/scss/_variables.scss`
  * 頁面樣式：`src/styles/scss/page.scss`
  * 預處理器：Sass（modern-compiler），副檔名一律 `.scss`

### 5.3 Level C：檔案類型規則

* **.vue**：多字元件名（例如 `UserCard.vue`）；邏輯拆分至可重用組件；嚴禁重複造輪子取代 Vuetify。
* **.json（i18n）**：

  * 入口：`src/utils/i18n/locales/zh-TW.json`
  * **命名空間建議**：`page.*`、`btn.*`、`label.*`、`msg.*`、`err.*`
  * **Key 命名**：英文小駝峰（`userName`）、分群以第一層命名空間；**不得混用語系代碼於 key 名**。
  * **結構範例**：

    ```json
    {
      "page": { "index": { "title": "首頁" } },
      "btn": { "connectionStatusOk": "連線成功" },
      "label": { "type": "類型", "userName": "使用者名稱" },
      "msg": { "saved": "已儲存" },
      "err": { "network": "網路錯誤" }
    }
    ```
  * **使用範例**：

    ```vue
    <template><span>{{ t('page.index.title') }}</span></template>
    <script setup>
    import { useI18n } from 'vue-i18n'
    const { t } = useI18n()
    </script>
    ```
  * **驗收檢核**：JSON 必須通過語法校驗；新增/修改 key 需在對應 `README.md` 記錄。

### 5.4 Level D：資料夾職責與產出

* `src/components`：可重用元件；`common/` 放通用構件。
* `src/layouts/default`：導覽列元件。
* `src/pages`：頁面容器，組裝元件，不放無關工具。
* `src/utils/js`：共用邏輯工具；**不得依賴視圖元件**。
* `src/utils/i18n/locales`：語系檔集中地；**禁止零散 i18n 常量**。
* `public/json`：測試資料入口；**檔名以用途命名**（例如 `UserData.json`）。

### 5.5 Icon

* 優先使用 mdi：[https://pictogrammers.com/library/mdi/](https://pictogrammers.com/library/mdi/)

---

## 6. 測試資料（TestData）

* 入口：`public/json`
* 範例：

  ```json
  {
    "UserData": { "name": "王小明", "age": 14, "sex": "man" }
  }
  ```
* 新增/變更資料檔需於對應資料夾 `README.md` 登記。

---

## 7. 輸出與紀錄策略（實用版）

* **規範精華回聲（Rule Echo）**：任務開始前，列出 2–3 條關鍵規則 + 定位（層級/檔案/章節）。
* **完整規範**：保留於本檔；必要時引用章節（例如「參見 §5.3 .json（i18n）」）。
* **錯誤處理**：任何終端機錯誤 → 立即建立「修復任務」，以同一流程處理。

---

## 8. 衝突解決順序

1. 本文件較高層級規則（0→1→2→…）
2. 最新版本 > 舊版本
3. 更具體的子層規則 > 籠統上位規則（於同層不矛盾前提下）

---

## 9. 範本彙整（可複製使用）

### 9.1 行動計畫（簽入）

```
[行動計畫]
1. 目標：
2. 規範查核（Rule Echo）：
   - §5.3 .json（i18n） key 命名
   - §5.4 `src/components` 職責
3. 執行步驟：
   - …
4. 驗證計畫：每次寫檔檢查終端機
5. 紀錄計畫：更新對應資料夾 README.md（④ 變更紀錄）
```

### 9.2 行動簽出（單步）

```
[行動簽出報告]
- 執行動作：
- 程式碼驗證：
  - [ ] 成功/失敗
  - [ ] 錯誤摘要：
- 文件紀錄：
  - [ ] README.md 已更新（路徑）
- 下一步：
```

### 9.3 blueprint.md 條目

```
1. 目標：
2. 規範查核（Rule Echo）：
3. 執行步驟：
4. 驗證計畫：
5. 紀錄計畫：
6. 輸出：
7. 狀態：未開始/進行中/完成/阻塞
```

---

## 10. 版本與維護

* 本檔版本：v2.0（2025-09-24）
* 重大變更：

  * 修正編號錯亂、拆分初始化與任務規範、引入 Rule Echo、建立分層規則（A–D）與 i18n 明確化。
* 待辦：

  * 加入 JSON Schema 以自動驗證 `zh-TW.json` 結構（擴充 §5.3 驗收）。