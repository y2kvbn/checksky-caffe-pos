
# Project Blueprint

## Overview

This project is a comprehensive Point of Sale (POS) and dashboard application for a café, built with Vue.js, Pinia, and Vite. It provides a seamless, intuitive interface for managing orders, tracking revenue, configuring promotional activities, and handling customer reservations. The application is designed to be responsive and user-friendly, ensuring a smooth experience on both desktop and mobile devices.

## Key Features

- **User Authentication**: A secure login screen with a simulated password reset flow.
- **Dashboard**: A central hub for monitoring key business metrics and providing quick access to all features.
- **Point of Sale (POS)**: An interactive interface for placing orders and processing payments with integrated promotional logic. The menu categories are dynamically updated from the management dashboard.
- **Reservation Management**: An intuitive interface for managing customer reservations, including a day-based timeline, options for specific needs like baby chairs, and the ability to add customer notes.
- **Menu Management**: A back-office interface for full CRUD (Create, Read, Update, Delete) operations on menu categories, with changes dynamically reflected in the Point of Sale view.
- **Promotions Management**: A dedicated section for configuring various promotional campaigns.
- **State Management**: Centralized state management powered by Pinia.

## Styling and Design

- **Modern Aesthetics**: A clean and modern design with a focus on visual balance, clear typography, and a vibrant color palette.
- **Responsive Layout**: A fully responsive UI that adapts to different screen sizes.
- **Interactive Elements**: A rich set of interactive UI components, including animated charts, responsive buttons, and intuitive modals.
- **Visual Effects**: Subtle visual effects like drop shadows and glowing elements to create depth and interactivity.

## Current Implementation Plan

### Objective

To enhance the application by adding a notes feature to reservations for better customer service and implementing a comprehensive menu category management system in the dashboard to provide店家 complete control over the POS menu.

### Actionable Steps

1.  **Add Reservation Notes Feature**:
    -   **Store Update**: Modified `src/stores/reservations.js` to include a `notes` field in the reservation data structure, with default empty strings for new and updated entries.
    -   **UI Enhancement**: Updated `src/components/ReservationManagement.vue` to include a `<textarea>` in the add/edit modal, allowing users to input customer-specific requests.
    -   **Display Update**: Enhanced the reservation list to prominently display saved notes with a distinct style, making them easily visible to staff.

2.  **Implement Dynamic Menu Category Management**:
    -   **Store Refactoring**: Overhauled `src/stores/menu.js` to transform the static category list into a dynamic, state-managed `ref`. Added `addCategory`, `updateCategory`, and `deleteCategory` actions to provide full CRUD functionality. The update logic also handles the renaming of categories across all related menu items.
    -   **Management UI Redesign**: Completely redesigned `src/components/MenuManagement.vue` into a more intuitive two-column layout. The left panel is dedicated to category management (add, edit, delete), while the right panel displays the menu items for the selected category.
    -   **Dynamic POS View**: Updated `src/components/PointOfSale.vue` to fetch its category list from the `allCategories` computed property in the menu store, ensuring that any changes made in the management dashboard are instantly reflected in the customer-facing POS interface.

3.  **Update Blueprint**: The project's `blueprint.md` has been updated to reflect these new features and implementation details (This step is complete).

