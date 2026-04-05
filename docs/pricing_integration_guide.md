# Technical Guide: Integrating Firestore Pricing Data

This document provides the necessary instructions for `vishwavidarshana.com` to connect to and utilize the Firestore database from `esystemlk.xyz` to build a quotation generator.

## 1. Firebase Project Connection

To access the data, you must connect to the same Firebase project. Use the following Firebase configuration object to initialize the Firebase app in your project. This configuration is safe to use on the client-side, as data access is controlled by Firestore Security Rules.

**It is critical that you use the exact same configuration.**

```javascript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
```
*You will need to get the actual values for these environment variables from the ESystemLk Firebase project settings.*

## 2. Firestore `pricing` Collection Structure

All pricing information is stored in a single Firestore collection named **`pricing`**.

### Overview

The collection consists of multiple documents. Each document represents a **top-level service category** (e.g., "E-Commerce & Online Sales", "Business & Corporate"). There is also one special document with the ID `common-addons`.

### Category Document Structure

Each category document has the following fields:

-   **`category`** (string): The display name of the category (e.g., "Healthcare & Wellness").
-   **`icon`** (string): The name of a `lucide-react` icon to display next to the category (e.g., "HeartPulse").
-   **`enabled`** (boolean): A flag to show or hide the entire category. **You must only fetch documents where `enabled` is `true`**.
-   **`order`** (number): A number used to sort the categories in the UI.
-   **`services`** (array): An array of `Service` objects.

#### `Service` Object Structure

Each object inside the `services` array has the following structure:

-   **`name`** (string): The name of the specific service (e.g., "Pharmacy Websites").
-   **`enabled`** (boolean): A flag to show or hide the service. **Your application should filter out services where `enabled` is `false`**.
-   **`tiers`** (array): An array of `Tier` objects representing different pricing packages for the service.
-   **`addons`** (array, optional): An optional array of `Addon` objects that can be added to the service.

##### `Tier` and `Addon` Object Structure

Both `Tier` and `Addon` objects share a simple structure:

-   **`name`** (string): The name of the tier or addon (e.g., "Starter Package", "Payment Integration").
-   **`price`** (string): The price, formatted as a string (e.g., "Rs. 25,000").

### Special Document: `common-addons`

There is a single document with the ID `common-addons`. This document contains addons that are applicable to *any* service.

-   **`category`** (string): "Common Add-Ons for Any Website".
-   **`icon`** (string): "Package".
-   **`enabled`** (boolean): A flag to show or hide this entire section.
-   **`items`** (array): An array of `Addon` objects, each with a `name` and `price`.

## 3. How to Fetch and Use the Data

Here is the recommended logic for fetching and processing the data to populate a quotation generator UI:

1.  **Query the `pricing` Collection**:
    -   Fetch all documents from the `pricing` collection.
    -   Sort the documents by the `order` field in ascending order.

2.  **Filter Enabled Categories**:
    -   Once you have the data, iterate through the documents and discard any where `enabled` is `false`.

3.  **Separate Common Add-ons**:
    -   Find the document where the `id` is `common-addons` and store it separately. This will populate a general add-ons section in your UI.

4.  **Process Service Categories**:
    -   For the remaining category documents, iterate through them.
    -   For each category, filter its `services` array to only include services where `enabled` is `true`.
    -   If a category has no enabled services after filtering, you can hide that category from the UI.

5.  **Populate the UI**:
    -   Use the processed data to build your quotation generator. A good approach is a multi-step form or cascading dropdowns:
        1.  User selects a **Category**.
        2.  The UI then shows a list/dropdown of **Services** within that category.
        3.  Once a service is selected, the UI displays its associated **Tiers** (e.g., as radio buttons or a select list) and **Add-ons** (e.g., as checkboxes).
        4.  The list of **Common Add-ons** should also be available as checkboxes, regardless of the selected category.
    -   When an item is selected, use its `price` string directly. You will need to parse the number out of the string (e.g., remove "Rs." and commas) to perform calculations for the quotation total.

### Example JavaScript/TypeScript Logic

```javascript
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firebase-config'; // Your initialized Firestore instance

async function getPricingData() {
    const pricingCollection = collection(db, 'pricing');
    const q = query(pricingCollection, orderBy('order'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        return { pricingData: [], commonAddons: null };
    }

    // Filter out disabled categories at the top level
    const allData = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(category => category.enabled);

    // Separate common addons
    const commonAddonsDoc = allData.find(d => d.id === 'common-addons');

    // Filter services within each remaining category
    const pricingData = allData
        .filter(d => d.id !== 'common-addons')
        .map(category => {
            if (category.services) {
                // Only keep enabled services
                category.services = category.services.filter(service => service.enabled);
            }
            return category;
        })
        // Only keep categories that still have services after filtering
        .filter(category => category.services && category.services.length > 0);

    return { pricingData, commonAddons: commonAddonsDoc || null };
}
```

By following this guide, `vishwavidarshana.com` can effectively use the shared pricing data to build a fully functional and synchronized quotation generator.
