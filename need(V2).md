# GEMINI 畫面分析與輸出規範（可直接複製使用）

> **原則**：若設計圖與本規範衝突，**以本規範為優先**；差異需於「差異說明」條列。  
> **產出**：所有分析結果須輸出為 `GEMINI畫面分析.md`（見第 4 節模板）。

---

## 一、專案需求描述為 GEMINI 優先於設計圖分析
- 本文件之規則在未另行註明前，**優先於設計圖**。  
- 設計圖僅作為補充與比對依據；任何與本規範不一致之處，需在「差異說明」列出原因與數值。

---

## 二、[專案需求]
1. **目前無專案或畫面描述**  
   - 由設計圖與本規範推導可執行之頁面與元件規格。

---

## 三、設計圖分析指引（請 Gemini 依下列步驟產出）
1. **佈局分析**  
   - 描述頁面主要結構（幾欄式、各欄寬度、間距、Sticky 規則、卡片每列數量）。
2. **顏色分析**  
   - 列出可見色（HEX），並標註對應區塊；若與專案規範色票不同，須提出替代或映射。
3. **元件化建議**  
   - 依結構與重複性，提出元件拆分（元件名、責任、Props、Events），附父子層級。

---

## 四、元件化分析規範
### 4.1 重複 UI 模式（Repetitive Patterns）
- **目的**：將結構相同、內容不同的區塊元件化。  
- **範例**：商品列表之「商品卡片」`ProductCard.vue`、購物車之「商品項目」`CartItem.vue`。  
- **指令**：`請將 [重複的區塊描述] 元件化為 [ComponentName].vue`。

### 4.2 功能獨立區塊（Functional Blocks）
- **目的**：拆出具獨立狀態與邏輯之區塊。  
- **範例**：右側「我的購物車」`ShoppingCart.vue`（管理清單、計價、結帳 CTA）。  
- **指令**：`請將 [功能區塊描述] 建立為獨立元件 [ComponentName].vue`。

### 4.3 職責邊界（Props & Events）
- **Props**：呈現所需最小資料集合（型別、是否必填、預設）。  
- **Events**：向外通報的事件（事件名、參數）。  
- **指令**：`建立 ProductCard.vue，接收 product 作為 prop，點擊時 emit('add-to-cart', productId)`。

### 4.4 命名與定位（Naming & Placement）
- **命名**：PascalCase（例：`UserCard.vue`、`ShoppingCart.vue`）。  
- **目錄**：
  - 可重用的業務元件：`/src/components/`  
  - 通用基礎元件（Button/Dialog 等）：`/src/components/common/`  
- **指令**：`建立 ProductCard.vue 並置於 /src/components/`。

### 4.5 無設計圖時的元件化流程
1. **從需求抽取名詞**：如「商品列表 / 商品 / 加入按鈕」。  
2. **按功能分組**：如購物車 → `CartList` / `CartItem` / `CheckoutButton`。  
3. **層級與職責**：父元件抓資料、子元件純展示；明確 Props/Emits。

---

## 五、輸出文件模板（請將分析結果輸出為 `GEMINI畫面分析.md`）

**專案**：［專案名稱］  
**版本**：v1.0  
**技術**：Vue 3 `<script setup>` / Pinia / Vue Router / Vite  
**UI 工具**：Vuetify

---

### 1) 全域設計系統（必填、數值化）
- **版心/間距**
  - 版心寬：［1200px］（置中）
  - 左右安全邊距：［24px］
  - 間距刻度：［8px 基準：8/16/24/32…］
- **斷點（RWD）**
  - lg：≥［1280］
  - md：［960–1279］
  - sm：<［960］
- **色彩（HEX）**
  - 主色：［#FF6A3D］
  - 次色：［#222222］
  - 字色淺：［#6B7280］
  - 邊框：［#E5E7EB］
  - 背景：［#FFFFFF］
  - 高亮/提醒：［#FEEFEA］
- **字體/字級**
  - 字族：［Noto Sans TC］；字重：［400/500/600/700］
  - H1：［24/32］、H2：［20/28］、Body：［16/24］、Caption：［14/20］
- **按鈕樣式**
  - 高度：［36px］；圓角：［9999px］
  - 主按鈕：底色［#FF6A3D］ / 字色［#FFFFFF］
  - Hover：明度＋［5%］；Disabled：不透明度［40%］
- **樣式檔**
  - `-- [編輯SCSS]` 檔名/路徑：［src/styles/theme.scss］

---

### 2) Page：［頁面名稱］
- **檔案**：［檔名.vue］  
- **路徑**：［/src/pages/…］  
- **功能**：［一句話功能敘述］

#### 2.1 佈局（lg）
- 欄數：［例：三欄］  
- 寬度：左［240px］ / 中［flex］ / 右［360px］  
- Sticky：右欄 sticky top［24px］（僅 ≥md）
- 卡片：每列［3 欄］、卡片最小寬［320px］、間距［24px / 24px］

#### 2.2 RWD 規則
- md：［側欄改水平分類列；商品 2 欄；購物車 320px sticky］
- sm：［單欄；水平分類可捲動；購物車下移、非 sticky］

#### 2.3 顏色使用（對應區塊）
- ［#FF6A3D］：按鈕 / Active 底線 / 高亮背景  
- ［#222222］：標題文字  
- ［#6B7280］：副標/說明文字  
- ［#E5E7EB］：分隔線/卡片邊框  
- ［#FFFFFF］：主要背景

#### 2.4 文字規範
- 區塊標題：［20/28，600］
- 商品標題：［16/24，600］
- 商品副標：［14/20，400，#6B7280］
- 價格：［16/24，700，#FF6A3D］

#### 2.5 互動行為
- 按鈕 hover/focus：陰影或底色變化（token：［btn-hover］）
- 鍵盤可達性：Tab 順序＝［分類 → 商品卡片（圖/名/加入）→ 購物車 → 結帳］
- ARIA：加入按鈕 `aria-label="加入：{商品名}"`

#### 2.6 差異說明（如與設計圖不同）
- 元素：［購物車陰影］  
- 設計期望：［較重陰影］  
- 實作數值：［Elevation 2］  
- 理由：［符合整體層級、避免搶視覺］

---

### 3) Layouts：`/layouts/default/navbar.vue`（如適用）
- **功能**：［導覽列/返回/訂位/回首頁］
- **尺寸**：高度［56px］；左右內距［16px］
- **RWD**：［sm 收合為漢堡選單；md+ 顯示完整項目］
- **顏色**：背景［#FFFFFF］；文字/圖示［#222222］；Active［#FF6A3D］
- **互動**：hover/active/焦點下劃線或底色變化

---

### 4) Components（必填：Props/Emits 清楚）
> 置於 `/src/components` 或 `/src/components/common`

| 元件 | 路徑 | 職責 | 結構概要 | Props（型別/必填/預設） | Emits（事件名/參數） |
|---|---|---|---|---|---|
| ProductCard | /components/ProductCard.vue | 顯示單一商品卡片 | 圖/名/副標/價/加入 | `product:Object!`、`theme:String='default'` | `add-to-cart(productId)` |
| CartItem | /components/CartItem.vue | 購物車項目 | 圖/名/單價/數量/刪除 | `item:Object!` | `update-qty(id, qty)`、`remove(id)` |
| CategoryMenu | /components/CategoryMenu.vue | 類別選單（側/橫） | 列表/Active 樣式 | `items:Array!`、`modelValue:String` | `update:modelValue(key)` |
| ShoppingCart | /components/ShoppingCart.vue | 購物車總覽/結帳 | 清單/小計/總計/CTA | `items:Array=[]`、`subtotal:Number=0`、`total:Number=0` | `checkout()` |

**樣式強制補充（如需要）**
- 商品圖片比例：［4:3］；圖片圓角：［12px］  
- 卡片圓角：［12px］；陰影：［Elevation 2］  
- 加入按鈕：高度［36px］、圓角［9999px］、主色底/白字

---

### 5) 資產/圖像
- 商品圖片：比例［4:3］、建議寬度［720px］  
- Icon：尺寸［24×24］，來源［mdi］

---

### 6) 驗收清單（硬性）
- [ ] 版心寬［1200px］、左右邊距［24px］，允差 ±2px  
- [ ] lg/md/sm 佈局切換符合規則（卡片 3/2/1 欄）  
- [ ] Sticky 僅在 ≥md 生效、offset［24px］  
- [ ] 顏色 HEX 與規格一致（主色/邊框/背景/字色）  
- [ ] 元件 Props/Emits 與表格一致、無未定義事件  
- [ ] 鍵盤 Tab 順序正確、ARIA label 完整  
- [ ] 常見狀態（空購物車、超庫存）有對應樣式與互動

---

## 六、執行要求（MANDATORY）
1. **完成畫面分析**：依本模板填寫完整數值與表格。  
2. **讀取 `GEMINI(V2).md`**：依「強制行動協議 / 專案規範絕對優先級」執行；須先將規範回聲到聊天室，並回到 `GEMINI(V2).md` 逐項核對；其後所有需求均以該規範為準。