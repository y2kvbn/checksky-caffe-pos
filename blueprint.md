# Project Blueprint

## Overview

This project is a comprehensive Point of Sale (POS) and dashboard application for a café, built with Vue.js, Pinia, and Vite. It provides a seamless, intuitive interface for managing orders, tracking revenue, and configuring promotional activities. The application is designed to be responsive and user-friendly, ensuring a smooth experience on both desktop and mobile devices.

## Key Features

- **Dashboard**: A central hub for monitoring key business metrics, including a revenue analysis chart, order status tracking, and quick access to promotional settings.
- **Point of Sale (POS)**: An interactive interface for cashiers to place orders, manage the shopping cart, and process payments. It supports various promotion types, including single-item discounts, spend-and-get offers, and spend-and-get discounts.
- **Promotions Management**: A dedicated section for configuring and enabling different promotional campaigns, which are dynamically reflected in the POS system.
- **State Management**: Centralized state management powered by Pinia, ensuring data consistency across all components.

## Styling and Design

- **Modern Aesthetics**: The application features a clean and modern design with a focus on visual balance, clear typography, and a vibrant color palette.
- **Responsive Layout**: The UI is fully responsive and adapts to different screen sizes, providing an optimal experience on both desktop and mobile devices.
- **Interactive Elements**: The application incorporates a range of interactive UI components, including animated charts, responsive buttons, and intuitive modals, to enhance the user experience.
- **Visual Effects**: Subtle visual effects, such as drop shadows and glowing elements, are used to create a sense of depth and interactivity.

## Current Implementation Plan

### Objective

To fully integrate the promotion system with the Point of Sale (POS) component, ensuring that all three types of promotions—single-item discounts, spend-and-get offers, and spend-and-get discounts—are correctly applied to the shopping cart and reflected in the final order.

### Actionable Steps

1.  **Update Pinia Store**: The `promotions.js` store has been updated to manage the state for all three promotion types, including their enabled status, thresholds, and discount values.
2.  **Update Promotions Component**: The `Promotions.vue` component has been enhanced to allow users to configure and enable each promotion type. The UI is connected to the Pinia store to ensure that all changes are persisted.
3.  **Integrate with POS**: The `PointOfSale.vue` component has been updated to apply the promotion logic to the shopping cart. The cart now dynamically updates to reflect single-item discounts, and the total calculation includes spend-and-get discounts. Spend-and-get gifts are also added to the final order upon checkout.
4.  **Finalize and Verify**: The integration is now complete. The next step is to test the full checkout flow to ensure that all promotions are correctly applied and that the final order accurately reflects the applied discounts and gifts.
