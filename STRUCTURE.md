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
-   `page.tsx`: The main landing page with the parallax hero section.
-   `store/page.tsx`: The main e-commerce storefront page component.
-   `store/[productId]/page.tsx`: The dynamic page for displaying a single product's details.
-   `scan/page.tsx`: The component for the AI product scanning feature.
-   `login/page.tsx`: The main login portal, directing users to either the user or admin login page.
-   `login/user/page.tsx`: The login page for regular users.
-   `login/admin/page.tsx`: The login page for administrators.
-   `signup/page.tsx`: The page for new users to create an account.
-   `dashboard/page.tsx`: The dashboard for logged-in users to view their account details.
-   `admin/dashboard/page.tsx`: The dashboard for administrators to manage products and view store analytics.

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
-   `add-product-form.tsx`: A dialog form for admins to add new products to the store.
-   `theme-provider.tsx`: Manages the application's light and dark themes.
-   `theme-toggle.tsx`: The UI button for switching between themes.
-   `ui/`: Contains all the primitive UI components from **ShadCN UI**, such as `Button.tsx`, `Card.tsx`, `Dialog.tsx`, etc. Also includes the `hero-parallax.tsx` component for the landing page.

### `src/hooks`

Custom React hooks are defined here.

-   `use-mobile.tsx`: A hook to detect if the user is on a mobile device.

### `src/lib`

Shared utilities, type definitions, and library functions.

-   `firebase.ts`: Initializes the Firebase app and exports the database and auth instances.
-   `types.ts`: Defines shared TypeScript types and interfaces used across the application (e.g., `Product`, `CartItem`).
-   `utils.ts`: Utility functions, including `cn` for merging Tailwind CSS classes.
