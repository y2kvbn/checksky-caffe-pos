# Blueprint

This document outlines the project's features, design, and the plan for the current requested change.

## Overview

A Point-of-Sale (POS) system for a coffee shop, designed for efficient order management, table reservations, and sales tracking.

## Features & Design

*   **Dashboard:** Central hub for real-time sales metrics, popular items, and daily operations.
*   **Point of Sale (POS):** Intuitive interface for placing orders, selecting items, and applying promotions.
*   **Menu Management:** Allows for creating, updating, and categorizing menu items, including complex set meals.
*   **Reservation Management:** A system to handle customer reservations with a timeline and calendar view.
*   **System Settings:** Configuration for receipt notes and other system parameters.
*   **Unique Order Numbers:** Orders are assigned a permanent, day-resetting number (`orderNumber`) for consistent tracking, separate from their display order.

## Current Task Plan

### Task 11: Definitive Fix for Price & Discount Logic

*   **Goal:** To permanently eradicate the recurring bug in the price and discount calculation logic, ensuring absolute accuracy, especially when promotions are applied.
*   **Status:** `Completed`

**Sub-tasks:**

1.  **[DONE]** Conducted a definitive Root Cause Analysis, identifying a critical variable assignment error in the `cartCalculation`'s return statement as the sole source of the bug.
2.  **[DONE]** Performed a complete, from-scratch rewrite of the `cartCalculation` computed property in `src/components/PointOfSale.vue`.
    *   Implemented a clear, multi-tiered calculation logic with unambiguous variable names (`finalPayableTotal`).
    *   Ensured the logic correctly calculates item-level discounts, then the subtotal, and finally the global discount.
    *   Guaranteed the returned `total` property **unambiguously** represents the final, post-discount payable amount.
3.  **[DONE]** Corrected the `processOrder` function to accurately record the discount amounts for each applied promotion in the final order payload.
4.  **[DONE]** Verified the final fix against the user-provided scenario, confirming the total is now correctly displayed as **NT$927**.

### Task 10: Receipt Notes Dynamic Binding

*   **Goal:** Link the 'Receipt Notes' text from System Settings to the order receipt preview.
*   **Status:** `Completed`

**Sub-tasks:**

1.  **[DONE]** Modify `src/components/PrintReceipt.vue` to import `useSettingsStore`.
2.  **[DONE]** Instantiate the settings store within the component's `<script setup>`.
3.  **[DONE]** Replace the static footer text (`<p>謝謝光臨</p>`) with a dynamic paragraph that binds to `settingsStore.receiptNotes`.
4.  **[DONE]** Verify the change in the UI.
