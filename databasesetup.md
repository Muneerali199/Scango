# Database Setup Guide (Firebase Firestore)

This guide outlines the steps to set up and configure Firebase Firestore as the database for the ScanGo application. Using a real database will allow for persistent data storage, real-time updates, and scalability beyond what `localStorage` can offer.

## 1. Why Firestore?

Firebase Firestore is a flexible, scalable NoSQL cloud database for mobile, web, and server development from Firebase and Google Cloud. It's an excellent choice for this project because:

-   **Real-time Updates:** Data syncs across all clients in real-time.
-   **Offline Support:** Apps remain responsive even when offline.
-   **Scalability:** It's built on Google Cloud's storage infrastructure.
-   **Powerful Querying:** Allows for complex queries.
-   **Security:** Comes with robust, rule-based security.

## 2. Setting Up Firestore in Your Firebase Project

1.  **Go to the Firebase Console:** Navigate to your [Firebase Console](https://console.firebase.google.com/) and select your `scango-a0649` project.

2.  **Create a Firestore Database:**
    -   In the left-hand navigation pane, click on **Build > Firestore Database**.
    -   Click the **"Create database"** button.

3.  **Choose a Mode:**
    -   You'll be prompted to start in **Production mode** or **Test mode**.
    -   For development, it's safe to start in **Test mode**. This allows open access for a limited time.
    -   **Important:** You will need to secure your database with security rules before deploying to production.
    -   Click **Next**.

4.  **Select a Location:**
    -   Choose a location for your Firestore data. This cannot be changed later. Pick a location that is closest to your user base.
    -   Click **Enable**.

Your Firestore database is now ready!

## 3. Data Structure

Firestore is a NoSQL database, which organizes data into **collections** and **documents**. Here is a recommended structure for the ScanGo app:

### `products` collection

This collection will store all the product information. Each document in this collection represents a single product.

-   **Collection:** `products`
-   **Document ID:** A unique product ID (e.g., `prod_001`, or an auto-generated ID).
-   **Document Data:**
    ```json
    {
      "name": "Sony WH-1000XM5 Wireless Headphones",
      "description": "Industry-leading noise canceling headphones...",
      "price": 399.99,
      "category": "Electronics",
      "image": "https://placehold.co/600x400.png",
      "data_ai_hint": "wireless headphones"
    }
    ```

### `users` collection

This collection will store information about your users, linked by their Firebase Authentication UID.

-   **Collection:** `users`
-   **Document ID:** The user's UID from Firebase Auth.
-   **Document Data:**
    -   This is a great place to store user-specific information, like their cart and wishlist, instead of `localStorage`.
    -   **Subcollection for Cart:**
        -   **Collection:** `cart`
        -   **Document ID:** Product ID
        -   **Data:** `{ "quantity": 2, "quality": "Standard" }`
    -   **Subcollection for Wishlist:**
        -   **Collection:** `wishlist`
        -   **Document ID:** Product ID
        -   **Data:** `{ "addedAt": "2024-07-31T12:00:00Z" }`

## 4. Basic Security Rules

Security is crucial. In your Firebase Console, go to **Firestore Database > Rules**. Here are some basic rules to get you started.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products are publicly readable, but only admins can write.
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'admin@example.com';
    }

    // A user can only access their own user document.
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

These rules ensure:
-   Anyone can view products.
-   Only a logged-in user with the email `admin@example.com` can create, update, or delete products.
-   Users can only read and write to their own data (like their cart and wishlist).

## Next Steps: Implementation in Code

To use Firestore in the app, you will need to:

1.  **Install the Firebase SDK:**
    ```bash
    npm install firebase
    ```
    *(This is already done in the project)*

2.  **Import and use Firestore functions:**
    -   In files where you need database access, import Firestore functions: `import { getFirestore, collection, getDocs, doc, setDoc } from "firebase/firestore";`
    -   You would replace calls to `localStorage` with async calls to Firestore to fetch and update data.
