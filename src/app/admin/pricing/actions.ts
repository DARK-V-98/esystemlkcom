
'use server';

import { writeBatch, doc, collection, updateDoc, deleteDoc, getDoc, setDoc, getDocs, Firestore } from 'firebase/firestore';

const pricingData = [
  {
    icon: "ShoppingCart",
    category: "E-Commerce & Online Sales",
    services: [
      {
        name: "Clothing & Fashion Stores",
        tiers: [
          { name: "Starter Package (Basic shop – 3 pages)", price: "Rs. 25,000" },
          { name: "Standard Package (Shop + Cart + Checkout)", price: "Rs. 40,000" },
          { name: "Premium Marketplace (Multi-vendor)", price: "Rs. 60,000" },
        ],
        addons: [
          { name: "Payment Integration", price: "Rs. 10,000" },
          { name: "Stock System", price: "Rs. 12,000" },
          { name: "Review System", price: "Rs. 5,000" },
        ],
      },
      {
        name: "Grocery Delivery",
        tiers: [
          { name: "Basic Grocery Listing Site", price: "Rs. 30,000" },
          { name: "Online Grocery Store (with delivery)", price: "Rs. 50,000" },
          { name: "Advanced E-Commerce Grocery Platform", price: "Rs. 75,000" },
        ],
        addons: [
            { name: "Delivery Time Picker", price: "Rs. 7,000" },
            { name: "Loyalty System", price: "Rs. 10,000" },
        ]
      },
      { name: "Electronics & Gadgets", tiers: [ { name: "Product Display Site (3 pages)", price: "Rs. 30,000" }, { name: "Cart + Comparison + Ratings Site", price: "Rs. 55,000" }, { name: "Advanced Tech Store", price: "Rs. 80,000" } ] },
      { name: "Handmade / Craft Shops", tiers: [ { name: "Starter Craft Shop (2–3 pages)", price: "Rs. 25,000" }, { name: "Cart-enabled Site", price: "Rs. 40,000" }, { name: "Full Brand Site with Custom Orders", price: "Rs. 60,000" } ] },
      { name: "Digital Products", tiers: [ { name: "Sell eBooks/Files Site", price: "Rs. 20,000" }, { name: "Member Access + Cart + Downloads", price: "Rs. 40,000" }, { name: "Licensing + Email Delivery System", price: "Rs. 60,000" } ] },
      { name: "Wholesale B2B Shops", tiers: [ { name: "Catalog + Inquiry Form", price: "Rs. 35,000" }, { name: "Business Login + Tiered Pricing", price: "Rs. 60,000" }, { name: "Full B2B E-Commerce System", price: "Rs. 85,000" } ] },
      { name: "Dropshipping Stores", tiers: [ { name: "Dropship Store Setup (Ready-to-sell)", price: "Rs. 45,000" }, { name: "Advanced Sync with Suppliers", price: "Rs. 75,000" } ] },
      { name: "Marketplace Platforms", tiers: [ { name: "Multi-vendor Listings Site", price: "Rs. 60,000" }, { name: "Vendor Dashboard + Order Tracking", price: "Rs. 90,000" }, { name: "Advanced Marketplace with Subscriptions", price: "Rs. 120,000" } ] },
    ],
  },
  {
    icon: "Building",
    category: "Business & Corporate",
    services: [
        { name: "Company Profile Websites", tiers: [{ name: "Single Page Intro Site", price: "Rs. 15,000" }, { name: "Full Company Site (About, Services, Contact)", price: "Rs. 30,000" }, { name: "Premium Profile + Case Studies + Blog", price: "Rs. 45,000" }]},
        { name: "Service-Based Businesses", tiers: [{ name: "Booking + Service Detail Site", price: "Rs. 35,000" }, { name: "Advanced Inquiry System + Feedback", price: "Rs. 50,000" }]},
        { name: "Legal & Law Firms", tiers: [{ name: "Professional Law Profile Site", price: "Rs. 30,000" }, { name: "Services + Team + Case Summaries", price: "Rs. 50,000" }]},
        { name: "Accounting & Finance Firms", tiers: [{ name: "Profile + Service List + Upload Forms", price: "Rs. 35,000" }, { name: "Client Login + Document Center", price: "Rs. 55,000" }]},
        { name: "Construction & Real Estate", tiers: [{ name: "Property Showcase Site", price: "Rs. 30,000" }, { name: "Listings + Filters + Inquiry Forms", price: "Rs. 50,000" }, { name: "Premium 3D Property Viewer", price: "Rs. 70,000" }]},
        { name: "Logistics & Courier Services", tiers: [{ name: "Info + Booking Form Site", price: "Rs. 35,000" }, { name: "Admin Panel + Tracking", price: "Rs. 60,000" }, { name: "Full Parcel Management Portal", price: "Rs. 90,000" }]},
        { name: "IT Companies & Startups", tiers: [{ name: "Company Profile + Product Showcase", price: "Rs. 35,000" }, { name: "Job Listings + Portfolio", price: "Rs. 50,000" }, { name: "Full Tech Startup Site", price: "Rs. 70,000" }]},
        { name: "Event Management Agencies", tiers: [{ name: "Event Portfolio Site", price: "Rs. 30,000" }, { name: "Package Listings + Inquiry Forms", price: "Rs. 50,000" }, { name: "Customer Reviews + Booking", price: "Rs. 70,000" }]},
        { name: "HR & Recruitment Firms", tiers: [{ name: "Job Board + Resume Upload", price: "Rs. 40,000" }, { name: "Application Tracking System", price: "Rs. 60,000" }]},
    ]
  },
  {
    icon: "Palette",
    category: "Logo & Brand Identity",
    services: [
        {
            name: "Professional Quality Logo Designs",
            tiers: [
                { name: "Essential Logo (Normal)", price: "Rs. 8,000" },
                { name: "Business Starter Kit (Standard)", price: "Rs. 15,000" },
                { name: "Premium Branding Suite (Advanced)", price: "Rs. 25,000" },
            ],
            addons: [
                { name: "Facebook Kit (Avatar, Banner, 5 Posts)", price: "Rs. 5,000" },
                { name: "YouTube Kit (Avatar, Banner, 5 Community Posts)", price: "Rs. 5,000" },
                { name: "Full Social Media Kit (FB, YT, Insta, LinkedIn)", price: "Rs. 12,000" },
                { name: "Business Card Design", price: "Rs. 3,000" },
                { name: "Animated Logo Intro", price: "Rs. 10,000" },
            ],
        },
    ],
  },
  {
    icon: "HeartPulse",
    category: "Healthcare & Wellness",
    services: [
        { name: "Pharmacy Websites", tiers: [{ name: "Medicine Display + Contact", price: "Rs. 30,000" }, { name: "Cart + Prescription Upload", price: "Rs. 50,000" }, { name: "Dashboard + Order History", price: "Rs. 75,000" }]},
        { name: "Private Clinics / Doctors", tiers: [{ name: "Doctor Bio + Contact Site", price: "Rs. 20,000" }, { name: "Appointment Booking Site", price: "Rs. 35,000" }, { name: "Patient Panel + Payment Gateway", price: "Rs. 60,000" }]},
        { name: "Physiotherapy & Rehab Centers", tiers: [{ name: "Therapy Info Site", price: "Rs. 25,000" }, { name: "Online Appointment Requests", price: "Rs. 40,000" }]},
        { name: "Caregiver & Elderly Care", tiers: [{ name: "Service Request Form", price: "Rs. 25,000" }, { name: "Schedule Management System", price: "Rs. 40,000" }]},
        { name: "Medical Education & Blogs", tiers: [{ name: "Health Blog with Content", price: "Rs. 20,000" }, { name: "Educational Videos & PDFs", price: "Rs. 35,000" }]},
    ]
  },
  {
    icon: "Scissors",
    category: "Beauty, Fashion & Lifestyle",
    services: [
        { name: "Salons & Barber Shops", tiers: [{ name: "Basic Info + Service Prices", price: "Rs. 25,000" }, { name: "Gallery + Booking System", price: "Rs. 40,000" }, { name: "Premium Salon Site", price: "Rs. 55,000" }]},
        { name: "Makeup Artists / Stylists", tiers: [{ name: "Personal Portfolio", price: "Rs. 20,000" }, { name: "Booking + Packages", price: "Rs. 35,000" }]},
        { name: "Nail, Spa, and Skincare Studios", tiers: [{ name: "Info + Price Lists", price: "Rs. 25,000" }, { name: "Online Booking + Memberships", price: "Rs. 45,000" }]},
        { name: "Fitness Trainers / Gyms", tiers: [{ name: "Trainer Profiles + Plans", price: "Rs. 30,000" }, { name: "Membership + Class Scheduling", price: "Rs. 50,000" }]},
        { name: "Tattoo Studios", tiers: [{ name: "Artist Portfolio", price: "Rs. 20,000" }, { name: "Appointment Booking", price: "Rs. 35,000" }]},
        { name: "Fashion Portfolios", tiers: [{ name: "Designer Showcase", price: "Rs. 15,000" }, { name: "Event Booking + Galleries", price: "Rs. 30,000" }]},
    ]
  },
  {
    icon: "Palette",
    category: "Creative & Personal Branding",
    services: [
        { name: "Photographers, Artists, Writers", tiers: [{ name: "Portfolio (2 pages)", price: "Rs. 18,000" }, { name: "Blog + Contact + Gallery", price: "Rs. 35,000" }]},
        { name: "Resume / CV Websites", tiers: [{ name: "One-page CV Website", price: "Rs. 12,000" }, { name: "3-page CV with Contact Form", price: "Rs. 20,000" }]},
        { name: "Influencers / Creators", tiers: [{ name: "Social Links + Content Showcase", price: "Rs. 25,000" }, { name: "Collaboration Forms + Merch Shop", price: "Rs. 40,000" }]},
        { name: "YouTubers / Streamers", tiers: [{ name: "Video Embeds + Sponsor Info", price: "Rs. 20,000" }, { name: "Donation Buttons + Merch Store", price: "Rs. 40,000" }]},
        { name: "Freelancers / Consultants", tiers: [{ name: "Service Showcase", price: "Rs. 20,000" }, { name: "Booking + Blog + Portfolio", price: "Rs. 40,000" }]},
    ]
  },
  {
    icon: "BookOpen",
    category: "Education & Learning",
    services: [
        { name: "Online Course Platforms", tiers: [{ name: "Mini Course Platform", price: "Rs. 45,000" }, { name: "Full LMS + Quizzes + Dashboard", price: "Rs. 75,000" }, { name: "Advanced eLearning Portal", price: "Rs. 120,000" }]},
        { name: "Tuition Classes / Institutes", tiers: [{ name: "Class Schedule + Enrollment Forms", price: "Rs. 30,000" }, { name: "Live Class Integration + Dashboard", price: "Rs. 55,000" }]},
        { name: "Driving Schools", tiers: [{ name: "Course Details + Booking Forms", price: "Rs. 25,000" }, { name: "Trainer Profiles + Document Uploads", price: "Rs. 40,000" }]},
        { name: "Preschools & Montessoris", tiers: [{ name: "Info + Enrollment Forms", price: "Rs. 25,000" }, { name: "Curriculum Preview + Parent Portal", price: "Rs. 45,000" }]},
        { name: "Language Learning Portals", tiers: [{ name: "Courses + Subscription Plans", price: "Rs. 30,000" }, { name: "Practice Tests + Teacher Messaging", price: "Rs. 50,000" }]},
    ]
  },
  {
    icon: "Users",
    category: "Cultural, Religious & Social",
    services: [
        { name: "Nonprofits / Charities / NGOs", tiers: [{ name: "Mission + Donation Gateway", price: "Rs. 20,000" }, { name: "Volunteer Forms + Event Listings", price: "Rs. 35,000" }]},
        { name: "Temples, Churches, Mosques", tiers: [{ name: "Prayer Times + Sermons", price: "Rs. 15,000" }, { name: "Donation Options + Event Photos", price: "Rs. 30,000" }]},
        { name: "Community Groups", tiers: [{ name: "Membership Signups + Event Calendars", price: "Rs. 15,000" }, { name: "Message Boards", price: "Rs. 25,000" }]},
        { name: "Donation Campaigns", tiers: [{ name: "Fundraising + Tracking Site", price: "Rs. 20,000" }] },
    ]
  },
  {
    icon: "Hotel",
    category: "Hospitality & Travel",
    services: [
        { name: "Hotels / Resorts / Villas", tiers: [{ name: "Room Galleries + Booking Forms", price: "Rs. 35,000" }, { name: "Payment Integration + Reviews", price: "Rs. 60,000" }]},
        { name: "Travel Agencies", tiers: [{ name: "Tour Packages + Itinerary Downloads", price: "Rs. 30,000" }, { name: "WhatsApp Bookings + Video Galleries", price: "Rs. 50,000" }]},
        { name: "Taxi & Cab Booking", tiers: [{ name: "Real-time Booking + Distance Pricing", price: "Rs. 40,000" }]},
        { name: "Rental Listings (Airbnb style)", tiers: [{ name: "Calendar Availability + Pricing Engine", price: "Rs. 40,000" }, { name: "Secure Booking System", price: "Rs. 60,000" }]},
        { name: "Restaurants with Online Ordering", tiers: [{ name: "Menu Display + Order Basket", price: "Rs. 30,000" }, { name: "Delivery Options + Table Reservations", price: "Rs. 50,000" }]},
    ]
  },
  {
    icon: "Landmark",
    category: "Government & Official Use",
    services: [
        { name: "Government Portals", tiers: [{ name: "Info Delivery + Notices", price: "Rs. 20,000" }, { name: "Online Forms + Department Listings", price: "Rs. 40,000" }]},
        { name: "Election Duty Management", tiers: [{ name: "Admin Panel + Staff Assignments", price: "Rs. 45,000" }, { name: "Location Checkers + Duty Schedules", price: "Rs. 65,000" }]},
        { name: "School Admin Panels", tiers: [{ name: "Student Logins + Attendance", price: "Rs. 40,000" }, { name: "Results + Teacher Communication", price: "Rs. 60,000" }]},
        { name: "Certificate Application Portals", tiers: [{ name: "Online Forms + Verification Tracking", price: "Rs. 40,000" }, { name: "Document Uploads", price: "Rs. 60,000" }]},
        { name: "Complaint/Feedback Systems", tiers: [{ name: "Public Complaint Forms + Ticket Tracking", price: "Rs. 35,000" }]},
    ]
  },
  {
    icon: "Blocks",
    category: "Advanced/Custom Applications",
    services: [
        { name: "Parcel Tracking Dashboards", tiers: [{ name: "Admin + Client Views + Real-time Tracking", price: "Rs. 60,000" }, { name: "SMS/Email Alerts", price: "Rs. 75,000" }]},
        { name: "Booking Systems", tiers: [{ name: "Appointment Scheduling + Rescheduling", price: "Rs. 40,000" }]},
        { name: "CRMs for Businesses", tiers: [{ name: "Lead Tracking + Invoices + Activity Logs", price: "Rs. 75,000" }]},
        { name: "Inventory Management", tiers: [{ name: "Stock Tracking + Alerts + Reports", price: "Rs. 60,000" }]},
        { name: "Invoice & Billing Systems", tiers: [{ name: "Invoice Creation + PDF Downloads", price: "Rs. 50,000" }]},
        { name: "Job Portals", tiers: [{ name: "Job Posting + Application Filtering", price: "Rs. 60,000" }]},
        { name: "Directory Listings", tiers: [{ name: "Searchable Listings (Vendors, Schools, etc.)", price: "Rs. 45,000" }]},
    ]
  },
];

const commonAddons = {
    icon: "Package",
    category: "Common Add-Ons for Any Website",
    items: [
        { name: "Payment Gateway Setup", price: "Rs. 10,000" },
        { name: "Admin Dashboard", price: "Rs. 15,000–30,000" },
        { name: "Appointment / Booking System", price: "Rs. 10,000" },
        { name: "Tracking System", price: "Rs. 12,000" },
        { name: "SMS / Email Alerts", price: "Rs. 8,000" },
        { name: "Inventory or Stock System", price: "Rs. 12,000" },
        { name: "Multi-language Support", price: "Rs. 7,000+" },
        { name: "Google Analytics + SEO Setup", price: "Rs. 3,000" },
    ]
};

export type PricingItemPath = {
    categoryId: string;
    serviceName?: string;
    tierName?: string;
    addonName?: string;
    isCommonAddon?: boolean;
    itemName?: string;
};

export type PricingItemData = {
    name?: string;
    price?: string;
    category?: string;
    icon?: string;
};


function sanitizeForId(text: string) {  
    return text.toLowerCase().replace(/[^a-z0-9&]+/g, '-').replace(/--+/g, '-').replace(/(^-|-$)/g, '');
}

export async function uploadPricingData(db: Firestore) {
    const batch = writeBatch(db);
    const pricingCollection = collection(db, 'pricing');

    pricingData.forEach((categoryData, index) => {
        const docId = sanitizeForId(categoryData.category);
        const docRef = doc(pricingCollection, docId);
        
        const servicesWithDefaults = categoryData.services.map(service => ({
            ...service,
            enabled: true,
        }));

        batch.set(docRef, {
            ...categoryData,
            services: servicesWithDefaults,
            order: index,
            enabled: true,
        });
    });
    
    const addonsDocRef = doc(pricingCollection, 'common-addons');
    batch.set(addonsDocRef, {
        ...commonAddons,
        order: pricingData.length,
        enabled: true,
    });

    try {
        await batch.commit();
        return { success: true, message: 'Pricing data uploaded successfully!' };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error("Error uploading pricing data: ", errorMessage);
        return { success: false, message: `Failed to upload pricing data: ${errorMessage}` };
    }
}

export async function updatePricingDocStatus(db: Firestore, docId: string, enabled: boolean) {
    const docRef = doc(db, 'pricing', docId);
    try {
        await updateDoc(docRef, { enabled });
        return { success: true, message: `Successfully ${enabled ? 'enabled' : 'disabled'} document.` };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, message: `Failed to update status: ${errorMessage}` };
    }
}

export async function deletePricingDoc(db: Firestore, docId: string) {
    const docRef = doc(db, 'pricing', docId);
    try {
        await deleteDoc(docRef);
        return { success: true, message: 'Successfully deleted document.' };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, message: `Failed to delete document: ${errorMessage}` };
    }
}

export async function updateServiceStatus(db: Firestore, categoryId: string, serviceName: string, enabled: boolean) {
    const categoryRef = doc(db, 'pricing', categoryId);
    try {
        const categorySnap = await getDoc(categoryRef);
        if (!categorySnap.exists()) {
            throw new Error("Category not found");
        }
        const categoryData = categorySnap.data();
        const updatedServices = categoryData.services.map((service: any) => 
            service.name === serviceName ? { ...service, enabled } : service
        );
        await updateDoc(categoryRef, { services: updatedServices });
        return { success: true, message: `Successfully updated service status.` };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, message: `Failed to update service status: ${errorMessage}` };
    }
}

export async function deleteServiceFromCategory(db: Firestore, categoryId: string, serviceName: string) {
    const categoryRef = doc(db, 'pricing', categoryId);
    try {
        const categorySnap = await getDoc(categoryRef);
        if (!categorySnap.exists()) {
            throw new Error("Category not found");
        }
        const categoryData = categorySnap.data();
        const updatedServices = categoryData.services.filter((service: any) => service.name !== serviceName);
        await updateDoc(categoryRef, { services: updatedServices });
        return { success: true, message: 'Successfully deleted service.' };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, message: `Failed to delete service: ${errorMessage}` };
    }
}

export async function updatePricingItem(db: Firestore, path: PricingItemPath, data: PricingItemData) {
    const docRef = doc(db, 'pricing', path.categoryId);
    try {
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            throw new Error("Document not found");
        }
        const docData = docSnap.data();

        let updatePayload: { [key: string]: any } = {};

        // Case 1: Update a common addon item
        if (path.isCommonAddon && path.itemName) {
            updatePayload.items = docData.items.map((item: any) =>
                item.name === path.itemName ? { ...item, name: data.name, price: data.price } : item
            );
        }
        // Case 2: Update a category's top-level fields
        else if (!path.serviceName) {
             updatePayload = { category: data.category, icon: data.icon };
        }
        // Case 3: Update nested items (service, tier, addon)
        else {
            updatePayload.services = docData.services.map((service: any) => {
                if (service.name !== path.serviceName) {
                    return service;
                }

                // Update service name
                if (!path.tierName && !path.addonName) {
                    return { ...service, name: data.name ?? service.name };
                }

                // Update a tier
                if (path.tierName) {
                    const updatedTiers = service.tiers.map((tier: any) =>
                        tier.name === path.tierName ? { ...tier, ...data } : tier
                    );
                    return { ...service, tiers: updatedTiers };
                }

                // Update an addon
                if (path.addonName) {
                    const updatedAddons = (service.addons || []).map((addon: any) =>
                        addon.name === path.addonName ? { ...addon, ...data } : addon
                    );
                    return { ...service, addons: updatedAddons };
                }

                return service;
            });
        }
        
        await updateDoc(docRef, updatePayload);
        return { success: true, message: 'Successfully updated item.' };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error("Error updating pricing item:", errorMessage);
        return { success: false, message: `Failed to update item: ${errorMessage}` };
    }
}


export type AddItemContext = {
    type: 'category' | 'service' | 'tier' | 'addon' | 'commonAddon';
    categoryId?: string;
    serviceName?: string;
};
export type AddItemData = {
    name: string;
    price?: string;
    icon?: string;
};

// New action to add items
export async function addPricingItem(db: Firestore, context: AddItemContext, data: AddItemData) {
    try {
        // Add a new Category
        if (context.type === 'category') {
            if (!data.name) throw new Error("Category name is required.");
            const newId = sanitizeForId(data.name);
            const docRef = doc(db, 'pricing', newId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                throw new Error('A category with this name already exists.');
            }
            const allDocs = await getDocs(collection(db, 'pricing'));
            const newCategory = {
                category: data.name,
                icon: data.icon || 'Package',
                services: [],
                enabled: true,
                order: allDocs.size,
            };
            await setDoc(docRef, newCategory);
            return { success: true, message: 'Successfully added category.' };
        }

        if (!context.categoryId) throw new Error("Category ID is required.");
        
        const docRef = doc(db, 'pricing', context.categoryId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) throw new Error("Category document not found.");
        
        const docData = docSnap.data();

        // Add a new Service to a Category
        if (context.type === 'service') {
            if (!data.name) throw new Error("Service name is required.");
            const newService = { name: data.name, tiers: [], addons: [], enabled: true };
            const updatedServices = [...(docData.services || []), newService];
            await updateDoc(docRef, { services: updatedServices });
            return { success: true, message: 'Successfully added service.' };
        }
        
        // Add a new Common Addon
        if (context.type === 'commonAddon') {
             if (!data.name || !data.price) throw new Error("Name and price are required for an addon.");
             const newItem = { name: data.name, price: data.price };
             const updatedItems = [...(docData.items || []), newItem];
             await updateDoc(docRef, { items: updatedItems });
             return { success: true, message: 'Successfully added common addon.' };
        }

        if (!context.serviceName) throw new Error("Service name is required.");
        
        const services = docData.services as any[];
        const serviceIndex = services.findIndex(s => s.name === context.serviceName);
        if (serviceIndex === -1) throw new Error("Service not found.");

        if (context.type === 'tier') {
            if (!data.name || !data.price) throw new Error("Name and price are required for a tier.");
            const newTier = { name: data.name, price: data.price };
            services[serviceIndex].tiers = [...(services[serviceIndex].tiers || []), newTier];
            await updateDoc(docRef, { services });
            return { success: true, message: 'Successfully added tier.' };
        }

        if (context.type === 'addon') {
            if (!data.name || !data.price) throw new Error("Name and price are required for an addon.");
            const newAddon = { name: data.name, price: data.price };
            services[serviceIndex].addons = [...(services[serviceIndex].addons || []), newAddon];
            await updateDoc(docRef, { services });
            return { success: true, message: 'Successfully added addon.' };
        }

        throw new Error("Invalid item type specified.");

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error("Error adding pricing item:", errorMessage);
        return { success: false, message: `Failed to add item: ${errorMessage}` };
    }
}
