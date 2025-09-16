
# 通用 Firebase 自動化部署終極指南 (GitHub Actions)

這是一份詳盡的、可適用於任何前端專案 (Vue, React, Angular 等) 的自動化部署設定指南。設定完成後，您未來的開發流程將會是：**專注寫程式，然後推送到 GitHub，網站便會自動更新**。從此告別手動部署和管理權杖的繁瑣工作。

---

## 核心理念：為什麼要這樣做？

我們拋棄了傳統的手動部署方式，原因如下：

- **脆弱的臨時權杖 (Token)**：手動部署依賴的授權權杖有時效性，容易過期，導致部署失敗。就像一張當日有效的門票，隔天就作廢了。
- **重複的勞動**：每次部署都需要在本機電腦上執行相同的指令 (`npm run build`, `firebase deploy`)，既耗時又容易出錯。
- **不安全的金鑰管理**：如果將權杖直接寫在腳本中，會有洩漏的風險。

**我們的解決方案是建立一個 CI/CD (持續整合/持續部署) 流水線：**

- **使用 GitHub Actions**：這是 GitHub 免費提供的自動化服務。我們可以設定一個「劇本」，讓它在我們推播程式碼時，自動執行一系列指令。
- **使用服務帳戶 (Service Account)**：我們將建立一個專門用於部署的「機器人帳戶」。它擁有一把永久有效的「萬能鑰匙」，可以安全地授予 GitHub Actions 部署的權限。

---

## 前提條件：開始前的準備工作

在設定之前，請確認您的專案已滿足以下條件：

1.  **Firebase 專案已建立**：您應該已經在 [Firebase 網站](https://firebase.google.com/) 上建立了一個專案，並知道您的 **專案 ID** (例如 `aicheck-squad`)。

2.  **GitHub 倉庫已建立**：您的專案程式碼已經存放在一個 GitHub 倉庫中。

3.  **建置指令 (`build` script)**：您的 `package.json` 檔案中，必須有一個名為 `build` 的腳本。這個腳本負責將您的原始碼打包成最終的靜態網站檔案 (通常在 `dist` 資料夾中)。
    *範例 (`package.json`):*
    ```json
    "scripts": {
      "dev": "vite",
      "build": "vue-tsc && vite build", // <-- 這個就是建置指令
      "preview": "vite preview"
    },
    ```

4.  **Firebase 設定檔 (`firebase.json`)**：專案根目錄需要有此檔案，用來告訴 Firebase 哪個資料夾是您的網站內容。
    - `public`: **極其重要**，此欄位的值必須和您 `build` 指令產生的資料夾名稱完全一致 (最常見的是 `dist`)。
    - `rewrites`: 對於 Vue、React 這類單頁應用 (SPA) 至關重要。它能確保使用者在瀏覽器中直接訪問深層路徑 (如 `your-site.com/users/123`) 時，依然能正確載入您的應用程式。

    *範例 `firebase.json` (適用於 Vite 專案):*
    ```json
    {
      "hosting": {
        "public": "dist", // <-- 必須與建置輸出的資料夾名稱相符
        "ignore": [
          "firebase.json",
          "**/.*",
          "**/node_modules/**"
        ],
        "rewrites": [
          {
            "source": "**",
            "destination": "/index.html"
          }
        ]
      }
    }
    ```

---

## 詳細設定步驟

### 第一步：撰寫 GitHub Actions 的「劇本」

此步驟是告訴 GitHub 的自動化機器人該做哪些事情。

1.  在您的專案根目錄，建立一個資料夾路徑：`.github/workflows/` (注意前面的點)。
2.  在 `.github/workflows/` 資料夾內，建立一個 YAML 檔案，例如 `firebase-deploy.yml`。
3.  將以下「劇本」內容完整地貼到 `firebase-deploy.yml` 檔案中：

    ```yaml
    # 工作流程的名稱
    name: Deploy to Firebase Hosting

    # 觸發條件：當有任何 commit 推送到 main 分支時
    on:
      push:
        branches:
          - main # 您可以修改為您專案的主要分支，例如 master

    # 工作任務
    jobs:
      build_and_deploy:
        # 執行環境：使用最新的 Ubuntu 系統
        runs-on: ubuntu-latest
        steps:
          # 步驟 1: 從 GitHub 倉庫下載您的最新程式碼到虛擬環境中
          - name: 1. Checkout Repo
            uses: actions/checkout@v4

          # 步驟 2: 設定 Node.js 環境，以便執行 npm 指令
          - name: 2. Setup Node.js
            uses: actions/setup-node@v4
            with:
              node-version: '20' # 可根據您的專案需求調整 Node.js 版本

          # 步驟 3: 安裝專案所需的所有依賴套件
          - name: 3. Install Dependencies
            run: npm install

          # 步驟 4: 執行 package.json 中的 build 指令，打包專案
          - name: 4. Build Project
            run: npm run build

          # 步驟 5: 部署到 Firebase
          - name: 5. Deploy to Firebase
            uses: FirebaseExtended/action-hosting-deploy@v0
            with:
              repoToken: '${{ secrets.GITHUB_TOKEN }}'
              # 使用我們即將設定的服務帳戶金鑰進行授權
              firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT_KEY }}'
              channelId: live # 部署到線上正式環境
              projectId: YOUR_FIREBASE_PROJECT_ID # <--- !! 在此填寫您自己的 Firebase 專案 ID
    ```

4.  **修改專案 ID**：在貼上的內容中，找到最後一行的 `YOUR_FIREBASE_PROJECT_ID`，並將其**替換成您自己的 Firebase 專案 ID** (例如 `aicheck-squad`)。這是最容易出錯的地方，請務必確認！

### 第二步：產生並儲存 Firebase「萬能鑰匙」

此步驟是為您的「機器人帳戶」產生一把永久有效的金鑰，並將它安全地交給 GitHub Actions。

1.  **前往 Google Cloud 服務帳戶頁面**:
    點擊下方連結模板，並將末尾的 `YOUR_PROJECT_ID` 替換成您的 Firebase 專案 ID，然後在瀏覽器中打開。
    `https://console.cloud.google.com/iam-admin/service-accounts?project=YOUR_PROJECT_ID`

2.  **建立服務帳戶**:
    - 點擊頁面頂部的 **「+ 建立服務帳戶」**。
    - **服務帳戶名稱**: 輸入一個好記的名稱，例如 `github-actions-deployer`。
    - 點擊 **「建立並繼續」**。
    - **指派角色**: 點擊「選取角色」下拉選單，在篩選框中輸入 `Firebase Hosting Admin`，然後選擇它。這遵循了「最小權限原則」，只給予它部署網站所需的權限，無法操作您的資料庫或其他服務。
    - 點擊 **「繼續」**，然後直接點擊 **「完成」**。

3.  **產生金鑰檔案 (JSON)**:
    - 在服務帳戶列表中，找到您剛才建立的帳戶。
    - 點擊它最右邊的「三個點」圖示(動作) -> 選擇 **「管理金鑰」**。
    - 點擊 **「新增金鑰」** -> **「建立新的金鑰」**。
    - 確保金鑰類型為 **`JSON`**，然後點擊 **「建立」**。
    - 您的瀏覽器將會下載一個 `.json` 檔案。**這就是您的「萬能鑰匙」，它非常機密，絕對不要將它上傳到任何公共地方或 commit 到 Git 倉庫中。**

4.  **將金鑰安全地存放到 GitHub**:
    - 前往您的 GitHub 專案倉庫，點擊頁面頂部的 **`Settings`** (設定) 標籤。
    - 在左側選單中，找到 `Secrets and variables` (祕密和變數)，點擊它，然後選擇 **`Actions`**。
    - 在 `Repository secrets` 區塊，點擊 **`New repository secret`** (新增倉庫祕密) 按鈕。
    - **Name**: 填寫 `FIREBASE_SERVICE_ACCOUNT_KEY` (**名稱必須與 `firebase-deploy.yml` 檔案中使用的完全一致，建議直接複製**)。
    - **Secret**: 使用文字編輯器打開您剛剛下載的 `.json` 金鑰檔案，**複製裡面的全部內容** (從 `{` 到 `}` )，然後**貼到這個輸入框中**。
    - 點擊 **`Add secret`** (新增祕密)。

### 第三步：推送程式碼，啟動自動化！

1.  將您剛剛在專案中建立的 `.github/workflows/firebase-deploy.yml` 檔案，透過 `git` 指令推送到 GitHub。
    ```bash
    git add .github/workflows/firebase-deploy.yml
    git commit -m "feat: Add CI/CD workflow for Firebase deployment"
    git push
    ```
2.  推送完成後，前往您 GitHub 倉庫的 **`Actions`** (動作) 標籤頁。
3.  您會看到一個新的工作流程已經開始執行。點進去，您可以即時觀看機器人正在按照您的「劇本」一步步建置和部署您的專案。
4.  當所有步驟都顯示綠色勾勾 `✅` 時，代表您的網站已成功部署到 Firebase！

---

## 流程總結

一旦上述設定完成，您未來的整個工作流程將簡化為以下循環：

1.  **您 (開發者)**：在本地電腦上編寫程式碼、增加新功能、修復錯誤。

2.  **推送 (Push)**：當您完成工作後，執行 `git push` 將程式碼變更推送到 GitHub 的 `main` 分支。

3.  **觸發 (Trigger)**：GitHub Actions 自動偵測到您的推送，並立即啟動 `firebase-deploy.yml` 劇本中定義的自動化流程。

4.  **建置 (Build)**：機器人在一個乾淨的雲端虛擬環境中，自動執行 `npm install` 和 `npm run build`，將您的專案打包。

5.  **部署 (Deploy)**：機器人使用您安全儲存的 `FIREBASE_SERVICE_ACCOUNT_KEY` 金鑰，獲取臨時授權，並將打包好的 `dist` 資料夾上傳到 Firebase Hosting。

6.  **上線 (Live)**：幾分鐘後，您的網站就已在線上更新，全球使用者都可以看到最新的版本。

恭喜！您已成功為您的專案建立了現代化、專業且高效的自動化部署系統。
