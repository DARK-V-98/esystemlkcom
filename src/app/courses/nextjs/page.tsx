'use client';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code } from 'lucide-react';
import { useEffect, useState } from 'react';

const courseModules = [
    { id: 'getting-started', title: 'Getting Started', description: 'Create a new Next.js application using the dashboard starter example and explore the project.' },
    { id: 'css-styling', title: 'CSS Styling', description: 'Style your Next.js application with Tailwind and CSS modules.' },
    { id: 'optimizing-fonts-and-images', title: 'Optimizing Fonts and Images', description: 'Optimize fonts and images with the Next.js built-in components.' },
    { id: 'creating-layouts-and-pages', title: 'Creating Layouts and Pages', description: 'Create the dashboard routes and a shared layout that can be shared between multiple pages.' },
    { id: 'navigating-between-pages', title: 'Navigating Between Pages', description: 'Learn how to use the <Link> component to navigate between pages.' },
    { id: 'setting-up-your-database', title: 'Setting Up Your Database', description: 'Setup a database for your application and seed it with initial data.' },
    { id: 'fetching-data', title: 'Fetching Data', description: 'Learn about the different ways to fetch data in Next.js, and fetch data for your dashboard page using Server Components.' },
    { id: 'static-and-dynamic-rendering', title: 'Static and Dynamic Rendering', description: 'Understand how rendering works in Next.js, and make your dashboard app dynamic.' },
    { id: 'streaming', title: 'Streaming', description: 'Improve your application\'s loading experience with streaming and loading skeletons.' },
    { id: 'adding-search-and-pagination', title: 'Adding Search and Pagination', description: 'Add search and pagination to your dashboard application using Next.js APIs.' },
    { id: 'mutating-data', title: 'Mutating Data', description: 'Mutate data using React Server Actions, and revalidate the Next.js cache.' },
    { id: 'handling-errors', title: 'Handling Errors', description: 'Handle errors gracefully with error.tsx and notFound.' },
    { id: 'improving-accessibility', title: 'Improving Accessibility', description: 'Implement server-side form validation and improve accessibility in your forms.' },
    { id: 'adding-authentication', title: 'Adding Authentication', description: 'Add authentication to protect your dashboard routes using NextAuth.js, Server Actions, and Proxy.' },
    { id: 'adding-metadata', title: 'Adding Metadata', description: 'Learn how to add metadata to your Next.js application.' },
    { id: 'next-steps', title: 'Next Steps', description: 'Next.js Dashboard Course Conclusion.' },
];

const CodeBlock = ({ code }: { code: string }) => (
    <pre className="bg-black/80 rounded-lg p-4 my-4 overflow-x-auto">
        <code className="text-sm font-mono text-white">{code.trim()}</code>
    </pre>
);

const NextJsCoursePage = () => {
    const [activeId, setActiveId] = useState('');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "0px 0px -50% 0px" }
        );

        courseModules.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            courseModules.forEach(({ id }) => {
                const element = document.getElementById(id);
                if (element) {
                    observer.unobserve(element);
                }
            });
        };
    }, []);
    return (
        <div className="container mx-auto px-4 md:px-6 py-20 md:py-28">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-black">Next.js Foundations</h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl mt-4">
                    Learn how to build a full-stack web application with the free, Next.js Foundations course.
                </p>
            </motion.div>

            <div className="grid lg:grid-cols-4 gap-12 mt-16 items-start">
                <aside className="lg:col-span-1 lg:sticky top-28 hidden lg:block">
                    <h3 className="font-headline text-xl font-semibold mb-4 text-black">Course Modules</h3>
                    <ul className="space-y-2">
                        {courseModules.map((module) => (
                            <li key={module.id}>
                                <a
                                    href={`#${module.id}`}
                                    className={`block p-2 rounded-md transition-colors text-sm ${
                                        activeId === module.id
                                            ? 'bg-primary/10 text-primary font-semibold'
                                            : 'text-muted-foreground hover:bg-black/5 hover:text-black'
                                    }`}
                                >
                                    {module.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </aside>

                <main className="lg:col-span-3 space-y-16">
                    {courseModules.map((module, index) => (
                        <motion.section
                            key={module.id}
                            id={module.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card className="bg-card border-border rounded-3xl shadow-xl">
                                <CardHeader>
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center font-bold text-primary text-lg">
                                            {index + 1}
                                        </div>
                                        <CardTitle className="font-headline text-2xl md:text-3xl font-bold text-primary">{module.title}</CardTitle>
                                    </div>
                                    <p className="text-muted-foreground">{module.description}</p>
                                </CardHeader>
                                <CardContent className="prose prose-neutral dark:prose-invert prose-lg max-w-none text-black space-y-4">
                                   <CourseContent module={module.id} />
                                </CardContent>
                            </Card>
                        </motion.section>
                    ))}
                </main>
            </div>
        </div>
    );
};

const CourseContent = ({ module }: { module: string }) => {
    switch (module) {
        case 'getting-started':
            return (
                <>
                    <p>Welcome! This course will guide you through building a full-stack Next.js application. We'll start from scratch and cover all the essential features. To begin, open your terminal and run the following command to create a new Next.js app using the official dashboard starter template.</p>
                    <CodeBlock code={`npx create-next-app@latest nextjs-dashboard --use-npm --example "https://github.com/vercel/next-learn/tree/main/dashboard/starter-example"`} />
                    <h4 className="text-black">Code Breakdown:</h4>
                     <ul className="list-disc pl-6 text-black">
                        <li><strong><code>npx create-next-app@latest</code></strong>: This is the command that runs the Next.js app creation tool. <code>npx</code> allows you to run package executables without installing them globally.</li>
                        <li><strong><code>nextjs-dashboard</code></strong>: This is the name of the directory that will be created for your new project.</li>
                        <li><strong><code>--use-npm</code></strong>: This flag tells the tool to use <code>npm</code> as the package manager instead of the default `yarn`.</li>
                        <li><strong><code>--example "..."</code></strong>: This flag specifies a template to clone from. In this case, we are using an official Vercel learning template.</li>
                    </ul>

                    <p>Once the installation is complete, navigate into your new project directory and start the development server:</p>
                    <CodeBlock code={`cd nextjs-dashboard\nnpm run dev`} />
                    <h4 className="text-black">Code Breakdown:</h4>
                     <ul className="list-disc pl-6 text-black">
                        <li><strong><code>cd nextjs-dashboard</code></strong>: Changes the current directory in your terminal to your new project folder.</li>
                        <li><strong><code>npm run dev</code></strong>: This command starts the Next.js development server, which includes features like live reloading and error reporting.</li>
                    </ul>
                    <p>Open <code>http://localhost:3000</code> in your browser. You should see the starter homepage. The project structure includes key folders like <code>app</code> for routing, <code>public</code> for static assets, and <code>ui</code> for our user interface components.</p>
                </>
            );
        case 'css-styling':
            return (
                <>
                    <p>Next.js offers multiple ways to style your application. This project uses Tailwind CSS, a utility-first CSS framework for rapid UI development.</p>
                    <p>You can style elements by adding Tailwind classes directly in your JSX. For example, to create a blue button:</p>
                    <CodeBlock code={`<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    Click me
</button>`} />
                    <h4 className="text-black">Code Breakdown:</h4>
                     <ul className="list-disc pl-6 text-black">
                        <li><strong><code>className="..."</code></strong>: In React, you use <code>className</code> instead of <code>class</code> to apply CSS classes.</li>
                        <li><strong><code>bg-blue-500</code></strong>: A Tailwind utility class that sets the background color.</li>
                        <li><strong><code>hover:bg-blue-700</code></strong>: A pseudo-class that changes the background color on hover.</li>
                         <li><strong><code>text-white, font-bold, py-2, px-4, rounded</code></strong>: These are other utility classes for text color, font weight, padding, and border radius.</li>
                    </ul>
                    <p>For component-specific styles that don't leak into the global scope, you can use CSS Modules. Create a file named <code>MyComponent.module.css</code> and import it into your component:</p>
                    <CodeBlock code={`/* In MyComponent.module.css */
.error {
  color: red;
}

// In your component
import styles from './MyComponent.module.css';

function MyComponent() {
  return <p className={styles.error}>This is an error.</p>;
}`} />
                     <h4 className="text-black">Code Breakdown:</h4>
                     <ul className="list-disc pl-6 text-black">
                        <li><strong><code>*.module.css</code></strong>: The <code>.module.css</code> extension tells Next.js to treat this as a CSS Module.</li>
                        <li><strong><code>import styles from ...</code></strong>: When imported, the CSS Module exports an object (<code>styles</code>) where keys correspond to your class names.</li>
                         <li><strong><code>className=&#123;styles.error&#125;</code></strong>: Next.js automatically generates a unique class name (e.g., <code>MyComponent_error__12345</code>) to prevent style conflicts with other components.</li>
                    </ul>
                </>
            );
        case 'optimizing-fonts-and-images':
            return (
                <>
                    <p>Next.js provides built-in components for optimizing fonts and images, which are crucial for good performance and Core Web Vitals.</p>
                    <h4 className="text-black">Fonts</h4>
                    <p>Use `next/font` to automatically host font files, preventing layout shifts and ensuring privacy.</p>
                    <CodeBlock code={`import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Layout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}`} />
                    <h4 className="text-black">Code Breakdown:</h4>
                    <ul className="list-disc pl-6 text-black">
                        <li><strong><code>import &#123; Inter &#125; from 'next/font/google'</code></strong>: Imports the desired font function from Google Fonts.</li>
                        <li><strong><code>const inter = Inter(...)</code></strong>: Initializes the font, specifying subsets to optimize for performance.</li>
                        <li><strong><code>className=&#123;inter.className&#125;</code></strong>: Applies the font's class name to the <code>&lt;html&gt;</code> element, ensuring it's used throughout the app. Next.js handles loading the font CSS automatically.</li>
                    </ul>
                    <h4 className="text-black">Images</h4>
                    <p>The <code>&lt;Image&gt;</code> component from <code>next/image</code> optimizes images by resizing, lazy-loading, and serving them in modern formats like WebP.</p>
                    <CodeBlock code={`import Image from 'next/image';

function Profile() {
  return (
    <Image
      src="/profile.png"
      alt="My Profile Picture"
      width={500}
      height={500}
    />
  );
}`} />
                    <h4 className="text-black">Code Breakdown:</h4>
                    <ul className="list-disc pl-6 text-black">
                        <li><strong><code>src="/profile.png"</code></strong>: The path to your image file, located in the <code>public</code> directory.</li>
                        <li><strong><code>alt="..."</code></strong>: Alternative text for accessibility, describing the image content.</li>
                        <li><strong><code>width=&#123;500&#125; height=&#123;500&#125;</code></strong>: These props are required to prevent layout shift. Next.js uses them to reserve space for the image while it loads.</li>
                    </ul>
                </>
            );
        case 'creating-layouts-and-pages':
            return (
                <>
                    <p>In the App Router, a <strong>page</strong> is UI that is unique to a route. You can create a page by exporting a component from a <code>page.tsx</code> file.</p>
                    <p>A <strong>layout</strong> is UI that is shared between multiple pages. Create a <code>layout.tsx</code> file to define a shared layout. It must accept a <code>children</code> prop that will be populated with a child layout or page.</p>
                    <CodeBlock code={`// app/dashboard/layout.tsx

export default function DashboardLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <section>
      {/* Include shared UI here, e.g., a sidebar */}
      <nav>Dashboard Sidebar</nav>
      {children}
    </section>
  );
}`} />
                    <h4 className="text-black">Code Breakdown:</h4>
                     <ul className="list-disc pl-6 text-black">
                        <li><strong><code>app/dashboard/layout.tsx</code></strong>: The file path defines the route segment (<code>/dashboard</code>) that this layout applies to.</li>
                        <li><strong><code>&#123; children &#125;: React.ReactNode</code></strong>: The <code>children</code> prop is a required prop that will be filled by Next.js with the content of the page or a nested layout.</li>
                         <li><strong><code>&lt;section&gt;...&lt;/section&gt;</code></strong>: This is the shared UI. The <code>&#123;children&#125;</code> prop is placed where the page-specific content should be rendered.</li>
                    </ul>
                    <p>Any pages inside the <code>app/dashboard</code> directory, like <code>app/dashboard/settings/page.tsx</code>, will automatically be wrapped with this layout.</p>
                </>
            );
        case 'navigating-between-pages':
            return (
                <>
                    <p>The <code>&lt;Link&gt;</code> component from <code>next/link</code> is used for client-side navigation between routes. It enables seamless transitions without a full page reload.</p>
                    <CodeBlock code={`import Link from 'next/link';
 
export default function Page() {
  return (
    <Link href="/dashboard">
      Dashboard
    </Link>
  );
}`} />
                     <h4 className="text-black">Code Breakdown:</h4>
                     <ul className="list-disc pl-6 text-black">
                        <li><strong><code>import Link from 'next/link'</code></strong>: Imports the necessary component.</li>
                        <li><strong><code>&lt;Link href="/dashboard"&gt;</code></strong>: The <code>href</code> prop specifies the destination route. Next.js will automatically pre-fetch this page in the background for faster navigation.</li>
                    </ul>
                    <p>The <code>usePathname()</code> hook can be used to check the current URL path and apply active styles to links.</p>
                     <CodeBlock code={`'use client';
 
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { clsx } from 'clsx';
 
export function NavLinks() {
  const pathname = usePathname();
 
  return (
    <Link
      className={clsx(
        'p-2 rounded-md',
        { 'bg-blue-500 text-white': pathname === '/dashboard' },
      )}
      href="/dashboard"
    >
      Home
    </Link>
  )
}`} />
                     <h4 className="text-black">Code Breakdown:</h4>
                     <ul className="list-disc pl-6 text-black">
                        <li><strong><code>'use client'</code></strong>: This directive is required because <code>usePathname</code> is a client-side hook.</li>
                        <li><strong><code>const pathname = usePathname()</code></strong>: This hook returns the current URL path as a string (e.g., '/dashboard/invoices').</li>
                         <li><strong><code>className=&#123;clsx(...)&#125;</code></strong>: <code>clsx</code> is a utility for conditionally applying class names. Here, it applies the active style (<code>bg-blue-500 text-white</code>) only if the <code>pathname</code> matches the link's <code>href</code>.</li>
                    </ul>
                </>
            );
        case 'setting-up-your-database':
            return (
                <>
                    <p>For this course, we'll use Vercel Postgres, but you can use any PostgreSQL provider. After creating a database, you'll get a connection string.</p>
                    <p>Add the connection string to a <code>.env</code> file in the root of your project:</p>
                    <CodeBlock code={`POSTGRES_URL="postgres://..."`} />
                    <h4 className="text-black">Code Breakdown:</h4>
                     <ul className="list-disc pl-6 text-black">
                        <li><strong><code>.env</code></strong>: This file stores environment variables, which are secret keys and configuration values that should not be committed to version control.</li>
                        <li><strong><code>POSTGRES_URL</code></strong>: The name of the variable that will hold your database connection string.</li>
                    </ul>
                    <p>Next, install the Vercel Postgres SDK: <code>npm install @vercel/postgres</code>.</p>
                    <p>To seed your database with initial data, you can create a script. For example, <code>scripts/seed.js</code>:</p>
                    <CodeBlock code={`// scripts/seed.js
const { db } = require('@vercel/postgres');

async function main() {
  const client = await db.connect();
  // ... (CREATE TABLE and INSERT statements)
  await client.end();
}

main().catch((err) => console.error(err));`} />
                    <h4 className="text-black">Code Breakdown:</h4>
                     <ul className="list-disc pl-6 text-black">
                        <li><strong><code>const &#123; db &#125; = require('@vercel/postgres')</code></strong>: Imports the database client from the SDK.</li>
                        <li><strong><code>await db.connect()</code></strong>: Establishes a connection to the database.</li>
                         <li><strong><code>// ... (CREATE TABLE and INSERT statements)</code></strong>: This is where you would write your SQL commands to define your tables and populate them with initial data.</li>
                        <li><strong><code>await client.end()</code></strong>: Closes the database connection.</li>
                    </ul>
                    <p>Run the script from your <code>package.json</code>: <code>"seed": "node -r dotenv/config ./scripts/seed.js"</code>.</p>
                </>
            );
        case 'fetching-data':
            return (
                <>
                    <p>In the App Router, React Server Components are the default. This allows you to fetch data directly within your components on the server.</p>
                    <p>You can fetch data at the component level, which is great for co-locating data fetching logic with the UI that uses it.</p>
                    <CodeBlock code={`// app/dashboard/page.tsx

import { fetchCardData } from '@/app/lib/data';
 
export default async function Page() {
  const { 
    numberOfInvoices, 
    numberOfCustomers, 
    totalPaidInvoices, 
    totalPendingInvoices 
  } = await fetchCardData();
 
  return (
    <main>
      {/* ... use the fetched data ... */}
    </main>
  );
}`} />
                    <h4 className="text-black">Code Breakdown:</h4>
                     <ul className="list-disc pl-6 text-black">
                        <li><strong><code>async function Page()</code></strong>: By making the Page component <code>async</code>, you can use <code>await</code> inside it to fetch data before rendering.</li>
                        <li><strong><code>await fetchCardData()</code></strong>: This calls your data-fetching function. The component will wait for this promise to resolve before it renders and sends the final HTML to the client.</li>
                        <li><strong>Server Component</strong>: Because there is no <code>'use client'</code> directive, this component renders entirely on the server. The fetched data is part of the initial HTML payload.</li>
                    </ul>
                    <p>Next.js automatically deduplicates <code>fetch</code> requests. If you use a database client, you should manually cache your data fetches using <code>React.cache</code> to avoid re-fetching the same data in a single render pass.</p>
                </>
            );
        case 'static-and-dynamic-rendering':
            return (
                <>
                    <p>By default, Next.js will use <strong>Static Rendering</strong>. Routes are rendered at build time, making them fast, always available, and cachable.</p>
                    <p>You can opt into <strong>Dynamic Rendering</strong> when you have data that changes frequently. This renders the route for each user at request time.</p>
                    <p>Dynamic rendering is triggered by using dynamic functions like <code>cookies()</code>, <code>headers()</code>, or by using the <code>unstable_noStore</code> API.</p>
                     <CodeBlock code={`import { unstable_noStore as noStore } from 'next/cache';

export async function fetchInvoices() {
  noStore(); // This opts the component into dynamic rendering
  // ... data fetching logic ...
}`} />
                     <h4 className="text-black">Code Breakdown:</h4>
                     <ul className="list-disc pl-6 text-black">
                        <li><strong><code>import &#123; unstable_noStore &#125;</code></strong>: Imports the specific API from Next.js to control caching behavior.</li>
                        <li><strong><code>noStore()</code></strong>: Calling this function inside a data-fetching function tells Next.js that this route should not be statically cached. It must be re-rendered for every incoming request to ensure the data is always fresh.</li>
                    </ul>
                </>
            );
        case 'streaming':
            return (
                <>
                    <p>Streaming allows you to break down the page into smaller chunks and progressively send them from the server to the client.</p>
                    <p>You can use React's <code>&lt;Suspense&gt;</code> boundary to stream a component. You provide a fallback UI (like a skeleton) to show while the component is loading.</p>
                    <CodeBlock code={`import { Suspense } from 'react';
import { RevenueChart } from '@/app/ui/dashboard/revenue-chart';
import { RevenueChartSkeleton } from '@/app/ui/skeletons';

export default function Page() {
  return (
    //...
    <Suspense fallback={<RevenueChartSkeleton />}>
      <RevenueChart />
    </Suspense>
    //...
  )
}`} />
                     <h4 className="text-black">Code Breakdown:</h4>
                     <ul className="list-disc pl-6 text-black">
                        <li><strong><code>&lt;Suspense&gt;</code></strong>: A built-in React component that lets you display a fallback while its children are loading.</li>
                        <li><strong><code>fallback=&#123;&lt;RevenueChartSkeleton /&gt;&#125;</code></strong>: The <code>fallback</code> prop takes a React component to render during the loading state.</li>
                        <li><strong><code>&lt;RevenueChart /&gt;</code></strong>: This is the actual component that fetches its own data. While it's fetching, the <code>RevenueChartSkeleton</code> will be displayed. Once ready, Next.js will stream the rendered HTML for <code>RevenueChart</code> to the client to replace the skeleton.</li>
                    </ul>
                    <p>This improves user experience by showing content sooner, even if some parts of the page take longer to fetch or render.</p>
                </>
            );
        case 'adding-search-and-pagination':
            return (
                <>
                    <p>To implement search and pagination, you'll use URL search parameters to manage the state.</p>
                    <p>First, capture the user's input in a client component. Use the <code>useRouter</code> and <code>usePathname</code> hooks to update the URL with the search query.</p>
                    <CodeBlock code={`'use client';
 
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
 
export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
 
  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(\`\${pathname\}?\${params.toString()}\`);
  }
}
`} />
                     <h4 className="text-black">Code Breakdown:</h4>
                     <ul className="list-disc pl-6 text-black">
                        <li><strong><code>'use client'</code></strong>: Required as we're using client-side hooks.</li>
                        <li><strong><code>useRouter(), usePathname(), useSearchParams()</code></strong>: Hooks from <code>next/navigation</code> to interact with the URL.</li>
                        <li><strong><code>URLSearchParams</code></strong>: A standard browser API to easily manipulate URL query parameters.</li>
                        <li><strong><code>params.set('query', term)</code></strong>: Adds or updates the <code>query</code> parameter in the URL.</li>
                        <li><strong><code>replace(...)</code></strong>: Updates the URL in the browser without reloading the page. This triggers a new server render with the updated search parameters.</li>
                    </ul>
                    <p>On the server, in your page component, read the search params from the <code>searchParams</code> prop and pass them to your data fetching function.</p>
                    <CodeBlock code={`export default async function Page({ 
  searchParams 
}: { 
  searchParams?: { query?: string; page?: string; } 
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const invoices = await fetchFilteredInvoices(query, currentPage);
  // ...
}`} />
                     <h4 className="text-black">Code Breakdown:</h4>
                     <ul className="list-disc pl-6 text-black">
                        <li><strong><code>&#123; searchParams &#125;</code></strong>: Next.js automatically passes the URL's search parameters as a prop to server-side Page components.</li>
                        <li><strong><code>const query = searchParams?.query || ''</code></strong>: Safely access the <code>query</code> parameter.</li>
                        <li><strong><code>await fetchFilteredInvoices(query, currentPage)</code></strong>: Your data fetching logic now uses the parameters from the URL to get the correct, filtered data from the database.</li>
                    </ul>
                </>
            );
        case 'mutating-data':
            return (
                <>
                    <p>React <strong>Server Actions</strong> allow you to run asynchronous code directly on the server, triggered from client-side events. They eliminate the need to create separate API endpoints for data mutations.</p>
                    <p>Define a Server Action by adding the <code>'use server';</code> directive at the top of a function.</p>
                     <CodeBlock code={`// In a file like 'app/lib/actions.ts'
'use server';
 
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
 
export async function createInvoice(formData: FormData) {
  // ... (validate and process formData)
 
  await sql\`INSERT INTO invoices ...\`;
 
  revalidatePath('/dashboard/invoices'); // Revalidate the cache and show new data
}`} />
                     <h4 className="text-black">Code Breakdown:</h4>
                     <ul className="list-disc pl-6 text-black">
                        <li><strong><code>'use server'</code></strong>: This directive marks the function as a Server Action, which can be called from client components but executes on the server.</li>
                        <li><strong><code>formData: FormData</code></strong>: The function automatically receives the form's data as a <code>FormData</code> object.</li>
                        <li><strong><code>await sql\`...\`</code></strong>: Your database mutation logic runs securely on the server.</li>
                        <li><strong><code>revalidatePath('/dashboard/invoices')</code></strong>: After the mutation, this tells Next.js to clear the cache for the specified path, forcing a re-fetch of the latest data on the next visit.</li>
                    </ul>
                    <p>You can then call this action directly from a form's <code>action</code> attribute.</p>
                </>
            );
        case 'handling-errors':
            return (
                <>
                    <p>The <code>error.tsx</code> file convention allows you to gracefully handle unexpected runtime errors in nested routes. It automatically wraps a page or child layout in a React Error Boundary.</p>
                    <CodeBlock code={`'use client';
 
export default function Error({ error, reset }: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </main>
  );
}`} />
                     <h4 className="text-black">Code Breakdown:</h4>
                     <ul className="list-disc pl-6 text-black">
                        <li><strong><code>'use client'</code></strong>: Error boundaries must be Client Components.</li>
                        <li><strong><code>error: Error</code></strong>: A prop that contains the caught error instance.</li>
                        <li><strong><code>reset: () =&gt; void</code></strong>: A function prop that, when called, attempts to re-render the segment where the error occurred.</li>
                    </ul>
                    <p>The <code>notFound()</code> function can be used to handle "not found" states. If called inside a route segment, it will render the closest <code>not-found.tsx</code> file.</p>
                    <CodeBlock code={`import { notFound } from 'next/navigation';
 
export default async function Page({ params }: { params: { id: string } }) {
  const invoice = await fetchInvoiceById(params.id);
  if (!invoice) {
    notFound();
  }
  // ...
}`} />
                     <h4 className="text-black">Code Breakdown:</h4>
                     <ul className="list-disc pl-6 text-black">
                        <li><strong><code>if (!invoice)</code></strong>: Checks if the data for a dynamic route (e.g., a specific blog post) exists.</li>
                        <li><strong><code>notFound()</code></strong>: If the data is not found, calling this function stops further rendering and displays the nearest <code>not-found.tsx</code> UI, returning a 404 status code.</li>
                    </ul>
                </>
            );
        case 'improving-accessibility':
            return (
                <>
                    <p>Web accessibility (a11y) is crucial for creating inclusive applications. Key practices include using semantic HTML, ensuring proper color contrast, and managing focus.</p>
                    <p>For forms, always associate labels with inputs using the <code>htmlFor</code> attribute. This helps screen readers announce what the input is for.</p>
                    <CodeBlock code={`<label htmlFor="amount">Choose an amount</label>
<input id="amount" name="amount" type="number" />`} />
                     <h4 className="text-black">Code Breakdown:</h4>
                     <ul className="list-disc pl-6 text-black">
                        <li><strong><code>&lt;label htmlFor="amount"&gt;</code></strong>: The <code>htmlFor</code> attribute points to the <code>id</code> of the input it describes.</li>
                        <li><strong><code>&lt;input id="amount" ... /&gt;</code></strong>: The <code>id</code> must match the label's <code>htmlFor</code> value to create the association.</li>
                    </ul>
                    <p>When creating custom components, use ARIA (Accessible Rich Internet Applications) attributes to provide additional context to assistive technologies. For example, <code>aria-live="polite"</code> can be used to announce status updates.</p>
                </>
            );
        case 'adding-authentication':
            return (
                <>
                    <p>NextAuth.js is a complete open-source authentication solution for Next.js applications. To add it, install <code>next-auth</code>.</p>
                    <p>Configure your authentication providers (e.g., Google, GitHub, Credentials) in an API route at <code>app/api/auth/[...nextauth]/route.ts</code>.</p>
                    <CodeBlock code={`import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      // ... configure credentials provider
    }),
  ],
});`} />
                     <h4 className="text-black">Code Breakdown:</h4>
                     <ul className="list-disc pl-6 text-black">
                        <li><strong><code>[...nextauth]/route.ts</code></strong>: This is a "catch-all" API route that handles all authentication-related requests (e.g., <code>/api/auth/signin</code>, <code>/api/auth/callback</code>).</li>
                        <li><strong><code>NextAuth(&#123;...&#125;)</code></strong>: The main function where you configure your authentication strategies.</li>
                        <li><strong><code>providers: [...]</code></strong>: An array where you define how users can sign in (e.g., with email/password via <code>Credentials</code>, or with Google/GitHub).</li>
                         <li><strong><code>export const &#123; auth, signIn, signOut &#125;</code></strong>: These are helper functions and middleware handlers that you'll use throughout your application to manage sessions and protect routes.</li>
                    </ul>
                    <p>You can protect routes by using middleware. Create a <code>middleware.ts</code> file in the root of your project to intercept requests and redirect unauthenticated users.</p>
                </>
            );
        case 'adding-metadata':
            return (
                <>
                    <p>Next.js has a Metadata API that allows you to define metadata (e.g., <code>title</code>, <code>description</code>) for each page, which is important for SEO.</p>
                    <p>You can export a static <code>metadata</code> object from a <code>layout.tsx</code> or <code>page.tsx</code> file.</p>
                    <CodeBlock code={`import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Invoices | Acme Dashboard',
};`} />
                     <h4 className="text-black">Code Breakdown:</h4>
                     <ul className="list-disc pl-6 text-black">
                        <li><strong><code>export const metadata</code></strong>: By exporting an object with this specific name, Next.js will automatically use it to generate the <code>&lt;head&gt;</code> tags for the page.</li>
                        <li><strong><code>title: '...'</code></strong>: This will set the <code>&lt;title&gt;</code> tag for the browser tab and search results.</li>
                    </ul>
                    <p>For dynamic routes, you can use the <code>generateMetadata</code> function to create metadata based on the current route parameters.</p>
                    <CodeBlock code={`export async function generateMetadata({ params }): Promise<Metadata> {
  const invoice = await fetchInvoiceById(params.id);
  return { title: \`Invoice #\${invoice.id}\` };
}`} />
                     <h4 className="text-black">Code Breakdown:</h4>
                     <ul className="list-disc pl-6 text-black">
                        <li><strong><code>export async function generateMetadata()</code></strong>: By exporting an <code>async</code> function with this name, you can fetch data to dynamically create metadata.</li>
                        <li><strong><code>&#123; params &#125;</code></strong>: The function receives the route's dynamic parameters (e.g., the <code>id</code> from <code>/invoices/[id]</code>).</li>
                        <li><strong><code>return &#123; title: ... &#125;</code></strong>: The returned object defines the metadata for that specific page, like the title for a unique invoice.</li>
                    </ul>
                </>
            );
        case 'next-steps':
            return (
                <>
                    <p>Congratulations on completing the Next.js Foundations course! You've learned the core concepts of building a full-stack application with the App Router.</p>
                    <h4>Where to go from here?</h4>
                    <ul className="list-disc pl-6 space-y-2 text-black">
                        <li><strong>Explore the Next.js Documentation:</strong> Dive deeper into advanced features like Parallel Routes, Intercepting Routes, and more.</li>
                        <li><strong>Build Your Own Project:</strong> The best way to learn is by doing. Start a personal project to apply and solidify your knowledge.</li>
                        <li><strong>Join the Community:</strong> Engage with other Next.js developers on GitHub, Discord, and Reddit.</li>
                    </ul>
                </>
            );
        default:
            return <p>Content for this module is coming soon!</p>;
    }
}


export default NextJsCoursePage;

    
    