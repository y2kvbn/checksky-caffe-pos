#!/bin/bash
# 這是一個自動化的部署腳本，請直接在您的終端機中執行它。

echo "🚀 開始部署您的網站到 Firebase..."

firebase deploy --only hosting

echo "✅ 部署完成！您的網站已成功發布！"
