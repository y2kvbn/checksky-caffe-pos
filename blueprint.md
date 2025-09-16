# Project Blueprint

## Overview

This project is a comprehensive Point of Sale (POS) and dashboard application for a café, built with Vue.js, Pinia, and Vite. It provides a seamless, intuitive interface for managing orders, tracking revenue, configuring promotional activities, and handling customer reservations. The application is designed to be responsive and user-friendly, ensuring a smooth experience on both desktop and mobile devices.

## Key Features

- **User Authentication**: A secure login screen with a simulated password reset flow.
- **Dashboard**: A central hub for monitoring key business metrics and providing quick access to all features.
- **Point of Sale (POS)**: An interactive interface for placing orders and processing payments with integrated promotional logic.
- **Reservation Management**: A completely redesigned, intuitive interface for managing customer reservations. The design prioritizes daily operations with a day-based navigation, a timeline view of bookings, and includes options for specific needs like baby chairs.
- **Promotions Management**: A dedicated section for configuring various promotional campaigns.
- **State Management**: Centralized state management powered by Pinia.

## Styling and Design

- **Modern Aesthetics**: A clean and modern design with a focus on visual balance, clear typography, and a vibrant color palette.
- **Responsive Layout**: A fully responsive UI that adapts to different screen sizes.
- **Interactive Elements**: A rich set of interactive UI components, including animated charts, responsive buttons, and intuitive modals.
- **Visual Effects**: Subtle visual effects like drop shadows and glowing elements to create depth and interactivity.

## Current Implementation Plan

### Objective

To overhaul the reservation management interface based on user feedback, focusing on a day-centric workflow, better space utilization, and additional reservation options. This includes ensuring seamless navigation from the main dashboard.

### Actionable Steps

1.  **Update Reservation Store**: The `src/stores/reservations.js` Pinia store will be updated. The data structure for a reservation will be augmented to include a `babyChairs` field to track requests for infant seating.

2.  **Refactor `App.vue` and `PointOfSale.vue`**: To ensure the "訂位總覽" button on the dashboard navigates correctly, the view-switching logic will be refactored.
    -   `App.vue` will be modified to pass parameters during view changes.
    -   `PointOfSale.vue` will accept an initial view parameter to directly open the reservation screen when requested.

3.  **Redesign `ReservationManagement.vue`**: The component will be completely rebuilt with a new layout and features:
    -   **Layout**: The two-column layout will be replaced with a more integrated design. A small calendar will be used for quick date navigation, while the main area will feature a timeline or list view for the selected day's bookings.
    -   **Navigation**: The primary navigation controls will be changed from month-based to day-based (e.g., "Previous Day" / "Next Day" buttons) for faster daily management.
    -   **Feature Addition**: The add/edit reservation modal will be updated to include a field for specifying the number of baby chairs.
    -   **Visuals**: The UI will be polished with a refined color scheme, improved typography, and a more intuitive layout to make booking information easier to read and manage.

4.  **Update Blueprint**: The project's `blueprint.md` will be updated to reflect the new design and implementation details (This step is complete).
