
// This script is used to seed the Firestore database with initial product data.
// To run this script, use the command: `npm run db:seed`

import { config } from 'dotenv';
config({ path: '.env' }); // Load environment variables from .env file

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, writeBatch } from "firebase/firestore";
import { products as seedProducts } from '../src/data/products';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(firebaseApp);

async function main() {
    try {
        console.log("Starting to seed the database...");
        
        const productsCollection = collection(db, "products");
        const batch = writeBatch(db);

        let count = 0;
        for (const product of seedProducts) {
            const docRef = collection(db, 'products').doc(); // Firestore generates ID
            batch.set(docRef, { ...product, views: 0 });
            count++;
        }
        
        await batch.commit();

        console.log(`✅ Successfully seeded ${count} products.`);
        
    } catch (error) {
        console.error("❌ Error seeding database:", error);
    }
}

main().then(() => {
    process.exit(0);
});
