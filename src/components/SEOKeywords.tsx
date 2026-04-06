'use client';

const keywordCategories = [
  {
    title: "Development Solutions",
    keywords: [
      "Custom Software Development", "Web Application Development", "Enterprise Software", "Mobile App Development Sri Lanka",
      "Bespoke Solutions", "Software Engineering Colombo", "Offshore Development", "DevOps Consulting", "Agile Development",
      "API Integration Services", "Software Modernization", "Cloud Native Apps", "Full Stack Development", "Backend Engineering",
      "Frontend Development", "Database Optimization", "SaaS Development", "Digital Transformation", "IT Services Sri Lanka"
    ]
  },
  {
    title: "Business Systems",
    keywords: [
      "POS System Sri Lanka", "Inventory Management", "Retail POS", "Restaurant Management", "Pharmacy POS",
      "HRM Software Colombo", "Payroll Systems", "Custom ERP Solutions", "CRM Software", "School Management System",
      "Hospital Software", "Hotel Booking Engine", "Invoice Generator", "Accounting Software", "Billing Systems",
      "Multi-store Management", "Stock Tracking", "Warehouse Management", "Business Automation"
    ]
  },
  {
    title: "Developer & SEO Tools",
    keywords: [
      "Free Developer Tools", "Online API Tester", "XML Sitemap Generator", "Robots.txt Creator", "Meta Tag Builder",
      "Favicon Generator", "Image Compressor WEBP", "Barcode Generator Online", "QR Code Creator", "Website Uptime Checker",
      "SSL Certificate Checker", "JSON to CSV Converter", "Web Performance Tools", "SEO Strategy Colombo", "Digital Growth",
      "Web Development Utilities", "Programmer Resources", "Coding Tools Online", "Schema Markup Generator"
    ]
  },
  {
    title: "Technologies",
    keywords: [
      "Next.js Experts", "React.js Developers", "TypeScript Development", "Tailwind CSS Design", "Node.js Backend",
      "Python Automation", "AI Integration", "Machine Learning Services", "Flutter App Design", "React Native Apps",
      "PostgreSQL Solutions", "MongoDB Experts", "Cloud Infrastructure", "AWS Hosting Sri Lanka", "Azure Developers",
      "Docker Containerization", "Kubernetes", "Microservices", "Serverless Computing"
    ]
  },
  {
    title: "Expertise Areas",
    keywords: [
      "E-commerce Website Design", "Professional UI/UX Design", "Responsive Web Development", "Progressive Web Apps",
      "Payment Gateway Integration", "DirectPay Sri Lanka", "LankaPay Integration", "PayHere Setup", "Dialog ezCash API",
      "Website Speed Optimization", "Fix Core Web Vitals", "SEO Audit Services", "Marketing Strategy", "StartUp Technology Partner",
      "High Volume Systems", "Secure Web Applications", "Scalable Tech Solutions", "Lifetime Software Maintenance"
    ]
  }
];

// Generate an additional ~150 long-tail keywords for the hidden section to hit the 300+ goal
const longTailKeywords = [
  "best software company sri lanka", "top it services colombo", "affordable web design kandy", "hire developers galle",
  "software company near me", "professional web software devs", "custom system building colombo", "advanced tech solutions",
  "future proof software", "secure business systems lk", "low cost pos system", "high quality software engineering",
  "modern technology partner", "digital excellence sri lanka", "innovative software products", "it consulting services",
  "cloud based business software", "remote developer team", "dedicated dedicated programmers", "tech startup assistance",
  "government software solutions lk", "private sector it services", "banking software integration", "logistics management app",
  "real estate portal development", "classified website sri lanka", "news portal design", "educational software lk",
  "online learning management", "advanced data visualization", "predictive analytics tools", "business intelligence colombo",
  "rpa robotic process automation", "workflow optimization agency", "no code low code experts", "zapier integration sri lanka",
  "n8n automation consultant", "marketing automation tools lk", "customer engagement software", "user acquisition strategy",
  "brand identity design", "corporate identity sri lanka", "tech brand building", "software testing services",
  "penetration testing colombo", "security vulnerability fix", "api security audit", "database scaling services",
  "real time dashboard development", "mobile first interface design", "accessible web design wcag", "multi language website",
  "sinhala unicode support", "tamil unicode tools", "local language software lk", "sri lanka tech ecosystem",
  "colombo tech hub company", "ict agency partners", "slasscom software exporters", "fitis it vendor", "premium web solutions",
  "elite software engineering", "expert coding service", "full life cycle development", "post launch support",
  "free software bug fixes", "reliable technology vendor", "trusted software partner sri lanka", "software innovations 2026",
  "next gen web apps", "modern dev stack", "high performance coding", "efficient database designs", "system load testing",
  "uptime monitoring experts", "domain health check", "digital footprint growth", "google search visibility colombo",
  "rank number 1 on google lk", "seo keywords for developers", "web dev search terms", "software industry keywords",
  "ict services search list", "technology index sri lanka", "colombo software directory", "best it firm lk",
  "customized application building", "software for pharmacy", "grocery store pos", "hardware shop billing",
  "clothing store management", "supermarket inventory system", "mobile shop software", "car sales management lk",
  "real estate lead system", "travel agent booking app", "tour operator system", "event management software",
  "ticketing system sri lanka", "membership management lk", "gym billing app", "salon management tools",
  "spa appointment system", "medical clinic software", "dental record system", "opd management system",
  "diagnostic lab software", "pathology system lk", "school ERP sri lanka", "tuition class management",
  "online exam platform", "student information system", "admission management system", "library catalog software",
  "inventory tracking colombo", "asset management sri lanka", "procurement system lk", "fleet management software",
  "delivery tracking system", "courier management app", "e-logistics solutions lk", "smart home app dev",
  "iot dashboard development", "industrial iot software", "connected device apps", "wearable tech solutions",
  "fintech developers sri lanka", "crypto payment integration", "blockchain consulting colombo", "nft marketplace dev",
  "decentralized applications dApps", "web3 startup support", "metamask integration", "solidity developers lk",
  "smart contract audit", "ai model fine tuning", "custom gpt integration", "ai content automation",
  "creative ai design", "automated reporting tools", "dashboard development experts", "data engineering sri lanka",
  "big data solutions lk", "data lake migration", "enterprise data strategy", "professional it consultancy"
];

const SEOKeywords = () => {
  return (
    <div className="border-t border-accent-foreground/5 pt-12 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary/40 mb-8 text-center italic">
          Capabilities & Expertise Directory
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {keywordCategories.map((cat) => (
            <div key={cat.title}>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-accent-foreground mb-4 opacity-80">
                {cat.title}
              </h4>
              <ul className="space-y-2">
                {cat.keywords.map((word) => (
                  <li key={word}>
                    <span 
                       className="text-[11px] text-accent-foreground/40 hover:text-primary transition-colors cursor-default"
                       title={`${word} Services by ESystemLk`}
                    >
                      {word}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Dense keyword cloud for semantic indexing (visually subtle) */}
        <div className="mt-12 pt-8 border-t border-accent-foreground/5">
           <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 opacity-20 hover:opacity-100 transition-opacity duration-700">
             {longTailKeywords.map((word) => (
               <span 
                 key={word} 
                 className="text-[9px] uppercase font-bold tracking-tighter text-accent-foreground/30 whitespace-nowrap"
               >
                 {word}
               </span>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default SEOKeywords;
