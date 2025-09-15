
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

#### 2. Menu Management (Current Task)
*   **View**: The main content area will display menu categories (特色風味簡餐, 單品咖啡, etc.).
*   **Categories**: Each category will display a list of its items.
*   **Items**: Each item will show a picture, name, and price.
*   **Actions**: 
    *   **Add**: Add a new item to a category.
    *   **Edit**: Modify an existing item's picture, name, and price.
    *   **Delete**: Remove an item from a category.

#### 3. Revenue Analysis (Planned)
*   **View**: The main content area will display charts for revenue analysis.
*   **Charts**: A line chart will be used to display revenue data.
*   **Data**: The chart will show revenue for the last 7 days and the last 30 days by default.

#### 4. Promotions (Planned)
*   **View**: A section to create and manage promotional activities.
*   **Promotion Types**:
    1.  Discounted price for a single item.
    2.  Gift with purchase (buy X, get Y).
    3.  Discount on total order amount (spend X, get Y% off).
*   **Actions**: Allow for creating, editing, activating, and deactivating promotions.

#### 5. System Settings (Planned)
*   **Login Management**: View login history.
*   **Receipt Notes**: A text field to customize the message at the bottom of customer receipts.
*   **Version Info**: Display the current application version (e.g., 1.0.0).
*   **Support Contact**: Display customer support contact information.

