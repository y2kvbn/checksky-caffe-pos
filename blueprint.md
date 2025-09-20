
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

To refactor the table selection feature by allowing users to select or change their table at any time during the ordering process, rather than being prompted only at checkout.

### Actionable Steps

1.  **Analyze Existing Flow**: Review the code for the checkout process, particularly in `PointOfSale.vue` and `SelectTableModal.vue`, to understand how table selection is currently triggered and handled.
2.  **Modify POS Interface**: Add a prominent button or display area in `PointOfSale.vue` that shows the currently selected table number and allows users to open the `SelectTableModal.vue` to either choose a new table or change the existing one.
3.  **Integrate Table Selection Modal**: Ensure the `SelectTableModal.vue` is triggered correctly from the new button in the POS interface.
4.  **Update State Management**: The selected table will be stored in the application's state so it can be accessed and updated throughout the ordering process.
5.  **Adjust Checkout Logic**: Remove the old logic that triggers the table selection modal during checkout. Instead, the system will now check if a table has been selected and, if not, prompt the user to select one before finalizing the order.
6.  **Update Blueprint**: The project's `blueprint.md` has been updated to reflect these new features and implementation details (This step is complete).
