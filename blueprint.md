# Project Blueprint

## Overview

This project is a comprehensive Point of Sale (POS) and dashboard application for a café, built with Vue.js, Pinia, and Vite. It provides a seamless, intuitive interface for managing orders, tracking revenue, and configuring promotional activities. The application is designed to be responsive and user-friendly, ensuring a smooth experience on both desktop and mobile devices.

## Key Features

- **User Authentication**: A secure and visually appealing login screen that serves as the entry point to the application. It validates user credentials and grants access to the main dashboard. It now includes a high-fidelity simulated **Password Reset** flow, allowing users to go through the process of entering a phone number, validating a mock SMS code, and setting a new password.
- **Dashboard**: A central hub for monitoring key business metrics, including a revenue analysis chart, order status tracking, and quick access to promotional settings.
- **Point of Sale (POS)**: An interactive interface for cashiers to place orders, manage the shopping cart, and process payments. It supports various promotion types, including single-item discounts, spend-and-get offers, and spend-and-get discounts.
- **Promotions Management**: A dedicated section for configuring and enabling different promotional campaigns, which are dynamically reflected in the POS system.
- **State Management**: Centralized state management powered by Pinia for core application features and local component state for the login flow, ensuring data consistency across all components.

## Styling and Design

- **Modern Aesthetics**: The application features a clean and modern design with a focus on visual balance, clear typography, and a vibrant color palette.
- **Responsive Layout**: The UI is fully responsive and adapts to different screen sizes, providing an optimal experience on both desktop and mobile devices.
- **Interactive Elements**: The application incorporates a range of interactive UI components, including animated charts, responsive buttons, and intuitive modals, to enhance the user experience.
- **Visual Effects**: Subtle visual effects, such as drop shadows and glowing elements, are used to create a sense of depth and interactivity.

## Current Implementation Plan

### Objective

To significantly enhance the login experience by implementing a simulated password reset feature, refining the layout and visual presentation, and improving user guidance text.

### Actionable Steps

1.  **Layout and Visual Redesign**: The `Login.vue` component's layout was updated. The three-image gallery on the left was replaced with a single, more immersive vertical image. This provides a cleaner and more focused aesthetic.

2.  **Text and Link Updates**: 
    - The "切換至 POS 後台" link was changed to **"聯繫客服"** and now functions as a `mailto:` link for customer support.
    - The system recommendation text was updated to **"建議使用平板設備操作，以享最佳的顯示結果"** and moved directly below the login button for better contextual placement.

3.  **Implement "Forgot Password" Flow**: 
    - A complete, multi-step user flow was created for password recovery. This is managed by a new `viewState` variable within the component.
    - The flow includes stages for: entering a phone number, entering a simulated 4-digit verification code, and setting/confirming a new password.

4.  **Component Refactoring & State Management**: 
    - The `Login.vue` component was heavily refactored to manage the different views (`login`, `forgotPassword`, `enterCode`, `resetPassword`, `success`) within a single file, making the logic clean and maintainable.
    - A simulated user database object was created to allow the new password to be temporarily stored, enabling the user to log in with it during the same session.

5.  **Finalize and Update Blueprint**: The project's `blueprint.md` has been updated to document the addition of the password reset functionality and the comprehensive redesign of the login component.