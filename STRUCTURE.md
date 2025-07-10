# Project Structure

This document provides an overview of the directory structure for the ScanGo application. Understanding this structure will help you navigate the codebase and contribute effectively.

## Root Directory

The root directory contains configuration files and the main `src` folder.

-   `.env`: Environment variables.
-   `next.config.ts`: Configuration for the Next.js framework.
-   `package.json`: Lists project dependencies and defines scripts.
-   `tailwind.config.ts`: Configuration for the Tailwind CSS utility-first framework.
-   `tsconfig.json`: TypeScript compiler options.
-   `README.md`: General information about the project.
-   `STRUCTURE.md`: This file.

## `src` Directory

The `src` directory is the heart of the application, containing all the source code.

### `src/app`

This directory follows the Next.js App Router convention for file-based routing, layouts, and pages.

-   `globals.css`: Global stylesheets and CSS variable definitions for themes (light/dark mode).
-   `layout.tsx`: The root layout component for the entire application.
-   `page.tsx`: The main e-commerce storefront page component.
-   `scan/page.tsx`: The component for the AI product scanning feature.

### `src/ai`

This directory houses all the Generative AI logic, powered by Genkit.

-   `genkit.ts`: Initializes and configures the main Genkit `ai` instance.
-   `flows/`: Contains all the Genkit flows.
    -   `product-analysis.ts`: Defines the AI flow for analyzing a product image and returning detailed insights.
    -   `product-recommendation.ts`: Defines the AI flow for generating product recommendations based on cart contents.

### `src/components`

This is where all the reusable React components are stored.

-   `header.tsx`: The main site header component.
-   `product-list.tsx`: Component that displays a grid of products.
-   `product-card.tsx`: A card component for a single product.
-   `shopping-cart.tsx`: The sidebar component that displays cart items and totals.
-   `cart-item.tsx`: A component for a single item within the shopping cart.
-   `ai-recommendations.tsx`: Component to display AI-powered product recommendations.
-   `camera-scanner.tsx`: The component that handles camera access and image capture for the scan feature.
-   `checkout-form.tsx`: The modal form for processing payments.
-   `theme-provider.tsx`: Manages the application's light and dark themes.
-   `theme-toggle.tsx`: The UI button for switching between themes.
-   `ui/`: Contains all the primitive UI components from **ShadCN UI**, such as `Button.tsx`, `Card.tsx`, `Dialog.tsx`, etc.

### `src/data`

This directory holds static data used by the application.

-   `products.ts`: An array of product objects, serving as the mock database for the store.

### `src/hooks`

Custom React hooks are defined here.

-   `use-toast.ts`: A hook for managing and displaying toast notifications.
-   `use-mobile.tsx`: A hook to detect if the user is on a mobile device.

### `src/lib`

Shared utilities, type definitions, and library functions.

-   `types.ts`: Defines shared TypeScript types and interfaces used across the application (e.g., `Product`, `CartItem`).
-   `utils.ts`: Utility functions, including `cn` for merging Tailwind CSS classes.
