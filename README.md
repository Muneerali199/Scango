# ScanGo - AI-Powered Smart Checkout & Product Analysis

Welcome to ScanGo, a futuristic e-commerce application that redefines the shopping experience by blending a seamless, modern storefront with powerful, AI-driven product intelligence. Built with a cutting-edge stack including Next.js, ShadCN UI, and Google's Genkit, this project is more than just a store—it's a smart shopping assistant. It empowers consumers to make healthier, more sustainable, and informed purchasing decisions by offering deep analysis of products through a simple camera scan. Featuring a beautiful parallax landing page, separate user and admin dashboards, and AI-powered recommendations, ScanGo demonstrates the future of intelligent and interactive retail.

![ScanGo App Showcase](https://placehold.co/1200x600.png)
*A placeholder for your app's hero image or GIF.*

---

## 🌟 The Vision

In today's retail landscape, customers lack immediate access to crucial product information like eco-friendliness, health impacts, or hidden discounts. ScanGo bridges this gap by providing an intelligent system where a simple scan reveals a product's full story, enabling shoppers to make informed, healthier, and more sustainable choices right in the aisle.

## ✨ Key Features

-   **📸 AI Product Scanner:** Use your device's camera to scan a product and get instant, detailed analysis on:
    -   Eco-friendliness score and carbon impact.
    -   Health and safety information, including harmful ingredients.
    -   Daily discounts and estimated expiry dates.
    -   Suggestions for better, healthier, or greener alternatives.
-   **🛍️ Modern E-commerce UI:** A beautiful and responsive interface built with ShadCN UI and Tailwind CSS, fetching live product data from a public API.
-   **🧠 AI-Powered Recommendations:** Utilizes Genkit to provide intelligent product suggestions based on the user's shopping cart contents.
-   **🎨 Stunning Landing Page:** A dynamic, parallax hero section to welcome users.
-   **🔍 Dynamic Product Filtering & Sorting:** Easily filter products by category and sort by name or price to find exactly what you need.
-   **🛒 Interactive Shopping Cart:** A fully functional cart to manage items, update quantities, and see a real-time total.
-   **👤 User & 🔑 Admin Dashboards:** Separate, secure dashboards for customer account management and administrator store oversight.
-   **☀️ Dark & 🌑 Light Modes:** A theme toggle allows users to switch between a sleek dark mode and a clean light mode.
-   **💳 Secure Checkout Simulation:** A modal-based checkout form for a seamless payment experience.
-   **❤️ Wishlist Functionality:** Users can save their favorite products to a persistent wishlist.
-   **📦 Admin Product Management:** Admins can add new products to the store directly from their dashboard, with changes appearing in real-time.

## 🖼️ Screenshots

| Landing Page | Store (Light Mode) |
| :---: | :---: |
| ![Landing Page Screenshot](https://placehold.co/600x400.png) | ![Light Mode Screenshot](https://placehold.co/600x400.png) |
| *Immersive parallax hero section.* | *Main product-browsing interface.* |

| Store (Dark Mode) | Admin Dashboard |
| :---: | :---: |
| ![Dark Mode Screenshot](https://placehold.co/600x400.png) | ![Admin Dashboard Screenshot](https://placehold.co/600x400.png) |
| *Sleek dark theme for comfortable viewing.* | *Comprehensive overview for store management.* |

| AI Scan Analysis | AI Cart Recommendations |
| :---: | :---: |
| ![AI Scan Screenshot](https://placehold.co/600x400.png) | ![AI Recommendations Screenshot](https://placehold.co/600x400.png) |
| *Instant product insights from a simple scan.* | *Personalized suggestions based on cart items.* |


## 🚀 Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/) (with App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
-   **Animations:** [Framer Motion](https://www.framer.com/motion/)
-   **Generative AI:** [Genkit](https://firebase.google.com/docs/genkit) (for product analysis and recommendations)
-   **Database:** Hybrid model - [Fake Store API](https://fakestoreapi.com/) for the initial product catalog and [Firebase Firestore](https://firebase.google.com/docs/firestore) for admin-added products and user data.
-   **Icons:** [Lucide React](https://lucide.dev/)
-   **Authentication:** [Firebase Auth](https://firebase.google.com/docs/auth)

For a detailed breakdown of the project structure, please see [STRUCTURE.md](STRUCTURE.md).

## 🛠️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   Node.js (v18 or later)
-   npm or yarn
-   A Firebase project with Firestore and Authentication enabled. See [databasesetup.md](databasesetup.md) for details.

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-folder>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a file named `.env` in the root of your project and add the following lines. Replace the placeholder values with your actual Firebase project credentials.

    ```
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

    # Set the email for the admin user
    NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result. The product catalog is fetched automatically from a live API, so no database seeding is required to get started!

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for details on our code of conduct, and the process for submitting pull requests to us.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

