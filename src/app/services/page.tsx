
import {
    ShoppingCart,
    Building,
    HeartPulse,
    Scissors,
    Palette,
    BookOpen,
    Users,
    Hotel,
    Landmark,
    Blocks,
} from "lucide-react";
import ServicesClient from './services-client';

const serviceCategories = [
    {
        icon: <ShoppingCart className="w-10 h-10 text-primary" />,
        title: "E-Commerce & Online Sales",
        items: [
            "Clothing & Fashion Stores",
            "Grocery Delivery",
            "Electronics & Gadgets",
            "Handmade/Craft Shops",
            "Digital Products (ebooks, music, courses)",
            "Wholesale B2B Shops",
            "Dropshipping Stores",
            "Marketplace Platforms (like OLX, Daraz)",
        ],
    },
    {
        icon: <Building className="w-10 h-10 text-primary" />,
        title: "Business & Corporate",
        items: [
            "Company Profile Websites",
            "Service-Based Businesses (plumbing, cleaning, carpentry)",
            "Legal & Law Firm Websites",
            "Accounting/Finance Firms",
            "Construction & Real Estate Agencies",
            "Logistics & Courier Services",
            "IT Companies & Tech Startups",
            "Event Management Agencies",
            "HR & Recruitment Firms",
        ],
    },
    {
        icon: <HeartPulse className="w-10 h-10 text-primary" />,
        title: "Healthcare & Wellness",
        items: [
            "Pharmacies & Online Medicine Ordering",
            "Private Clinics / Doctors / Dentists",
            "Physiotherapy & Rehab Centers",
            "Caregiver & Elderly Care Services",
            "Health Blogs / Medical Education",
            "Appointment Booking Systems",
        ],
    },
    {
        icon: <Scissors className="w-10 h-10 text-primary" />,
        title: "Beauty, Fashion & Lifestyle",
        items: [
            "Salons & Barber Shops",
            "Makeup Artists & Stylists",
            "Nail, Spa, and Skincare Studios",
            "Fitness Trainers / Gyms / Zumba",
            "Tattoo Studios",
            "Fashion Portfolios",
        ],
    },
    {
        icon: <Palette className="w-10 h-10 text-primary" />,
        title: "Creative & Personal Branding",
        items: [
            "Personal Portfolios (Photographers, Artists, Writers)",
            "Resume/CV Websites",
            "Digital Creators / Influencers",
            "YouTubers / Streamer Landing Pages",
            "Freelancers / Consultants",
            "Actor/Model Portfolios",
        ],
    },
    {
        icon: <BookOpen className="w-10 h-10 text-primary" />,
        title: "Education & Learning",
        items: [
            "Online Course Platforms (LMS)",
            "Tuition Classes / Educational Institutes",
            "Driving Schools",
            "Preschool & Montessori Websites",
            "Language Learning Portals",
            "E-learning Blogs / Notes Repositories",
        ],
    },
    {
        icon: <Users className="w-10 h-10 text-primary" />,
        title: "Cultural, Religious & Social",
        items: [
            "Nonprofits / Charities / NGOs",
            "Temples, Churches, and Mosques",
            "Community Groups",
            "Donation Platforms",
            "Blood Donation Campaigns",
        ],
    },
    {
        icon: <Hotel className="w-10 h-10 text-primary" />,
        title: "Hospitality & Travel",
        items: [
            "Hotels / Resorts / Villas",
            "Travel Agencies & Tour Booking",
            "Taxi & Cab Booking",
            "Airbnb-style Rental Listings",
            "Restaurants with Online Ordering",
        ],
    },
    {
        icon: <Landmark className="w-10 h-10 text-primary" />,
        title: "Government & Official Use",
        items: [
            "Local Government Websites",
            "Election Duty Management Systems",
            "School/College Admin Panels",
            "Certificate/License Application Portals",
            "Public Feedback/Complaint Systems",
        ],
    },
    {
        icon: <Blocks className="w-10 h-10 text-primary" />,
        title: "Advanced/Custom Applications",
        items: [
            "Parcel Tracking Dashboards",
            "Booking and Reservation Systems",
            "CRM Systems for Businesses",
            "Inventory Management Systems",
            "Invoice & Billing Systems",
            "Job Portals",
            "Directory Listings (e.g., wedding vendors, doctors)",
        ],
    },
];

export default function ServicesPage() {
  return (
    <>
      <section className="w-full py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6 text-center bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl py-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">What We Build</h1>
          <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl mt-4">
            We specialize in creating tailored web solutions across a wide range of industries. Explore our capabilities below.
          </p>
        </div>
      </section>

      <section className="w-full pb-20 md:pb-28">
        <ServicesClient serviceCategories={serviceCategories} />
      </section>
    </>
  );
}
