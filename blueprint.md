
# Project Blueprint

## Overview

This project is a single-page web application for a coffee shop's administrative dashboard, designed for tablet devices. It provides a summary of key metrics and navigation to other sections of the admin panel.

## Style, Design, and Features

### Style
*   **Color Palette**:
    *   Primary background: Light gray with a background image of a coffee shop patio.
    *   Sidebar: White, with a light orange for the selected item.
    *   Header: White.
    *   Buttons:
        *   Primary action: Bright red (`#ff4d4f`).
        *   Secondary action: Light orange (`#ffb997`).
        *   Tertiary action: White.
    *   Text: Dark gray/black.
*   **Typography**:
    *   A clean, modern, sans-serif font is used throughout the application.
    *   The main title "向天泓咖啡廳" has a distinctive, slightly blurred or glowing effect.
*   **Layout**:
    *   A fixed header contains the main title and a secondary button.
    *   A fixed sidebar on the left provides navigation.
    *   The main content area on the right displays key metrics and a list of current orders.
*   **Iconography**:
    *   The application uses simple, line-based icons for navigation and information display.

### Implemented & Planned Features

#### 1. Dashboard Home (Implemented)
*   Displays key metrics: Total Settled Amount, Unsettled Amount, Total Orders.
*   Shows a list of current orders (currently static).

#### 2. Point of Sale - Set Meal Logic (Current Task)
*   **Applies to**: "特色風味小火鍋" & "特色風味簡餐" categories.
*   **Standard Set Includes**:
    *   1 bowl of White Rice.
    *   1 standard Drink.
*   **Standard Drinks**:
    *   Iced/Hot Black Tea (冰/熱紅茶)
    *   Iced/Hot Coffee (冰/熱咖啡)
    *   Lactic Acid Drink (乳酸菌)
*   **Ordering Flow**:
    1.  Clicking a set meal item opens a configuration modal.
    2.  Modal allows selection of one standard drink.
    3.  Modal allows for upgrading to a non-standard drink with a NT$60 discount applied to the upgraded drink's price.
    4.  Modal allows for adding extra bowls of rice for NT$10 each.
*   **Order & Receipt Display**:
    *   The order details (in the UI and on the printed receipt) must list each component of the set meal separately.
    *   Example:
        *   招牌總匯鍋
        *   白飯 (附贈)
        *   冰紅茶 (附贈)
        *   額外加點白飯 (NT$10)
        *   拿鐵 (更換飲品折抵NT$60)

#### 3. Menu Management (Implemented)
*   **View**: The main content area will display menu categories.
*   **Items**: Each item shows a picture, name, and price.
*   **Actions**: Add, Edit, Delete items.

#### 4. Revenue Analysis (Planned)
*   **View**: Main content area will display charts for revenue analysis.
*   **Data**: Line chart showing revenue for the last 7 and 30 days.

#### 5. Promotions (Implemented)
*   **View**: Section to create and manage promotional activities.
*   **Types**: Item discounts, gift with purchase, order total discounts.
*   **Actions**: Create, edit, activate, deactivate promotions.

#### 6. System Settings (Implemented)
*   **Login Management**: View login history.
*   **Receipt Notes**: Customize receipt footer message.
*   **Version Info**: Display app version.
*   **Support Contact**: Display support info.

