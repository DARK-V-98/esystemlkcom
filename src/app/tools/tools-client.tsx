
'use client';
import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type ToolCategory = 'Utility' | 'Converter' | 'Image' | 'Security' | 'Design' | 'Web' | 'Text' | 'Documents' | 'Business';

interface Tool {
  icon: keyof typeof Icons;
  title: string;
  description: string;
  category: ToolCategory;
  link: string;
  style: 'primary' | 'secondary' | 'outline';
}

const allTools: Tool[] = [
  { icon: 'FileSignature', title: 'Invoice Generator', description: 'Create and download professional PDF invoices for your clients.', category: 'Business', link: '/tools/invoice-generator', style: 'primary' },
  { icon: 'Landmark', title: 'GST/VAT Calculator', description: 'Quickly add or remove GST/VAT from prices for your business calculations.', category: 'Business', link: '/tools/gst-vat-calculator', style: 'primary' },
  { icon: 'CandlestickChart', title: 'Currency Converter', description: 'Convert between major currencies using live exchange rates.', category: 'Business', link: '/tools/currency-converter', style: 'primary' },
  { icon: 'Server', title: 'Uptime Checker', description: 'Check if a website is online and responding from our server location.', category: 'Web', link: '/tools/uptime-checker', style: 'primary' },
  { icon: 'Terminal', title: 'API Tester', description: 'A lightweight, browser-based client to test your API endpoints. A mini Postman.', category: 'Web', link: '/tools/api-tester', style: 'secondary' },
  { icon: 'Barcode', title: 'Barcode Generator', description: 'Create standard barcodes (EAN, UPC, etc.) for products or inventory management.', category: 'Utility', link: '/tools/barcode-generator', style: 'outline' },
  { icon: 'Binary', title: 'Text <> Binary Converter', description: 'Convert text to its binary representation and back. Useful for developers and students.', category: 'Converter', link: '/tools/text-binary-converter', style: 'secondary' },
  { icon: 'FileCode', title: 'Code Minifier', description: 'Minify your CSS, JavaScript, and HTML code to reduce file size and improve load times.', category: 'Web', link: '/tools/code-minifier', style: 'secondary' },
  { icon: 'Palette', title: 'Color Palette Generator', description: 'Generate beautiful color palettes from a base color or randomly. Get HEX, RGB, and HSL values.', category: 'Design', link: '/tools/color-palette-generator', style: 'outline' },
  { icon: 'Lock', title: 'File Encryption & Decryption', description: 'Secure any file with AES-256 encryption. Lock and unlock files with a password, client-side.', category: 'Security', link: '/tools/file-encryption', style: 'outline' },
  { icon: 'FileImage', title: 'Image Converter', description: 'Convert image files between different formats (e.g., JPG, PNG, WEBP).', category: 'Image', link: '/tools/image-converter', style: 'primary' },
  { icon: 'Scan', title: 'Image Cropper', description: 'Crop specific areas of an image with an easy-to-use interface. Download only the selected part.', category: 'Image', link: '/tools/image-cropper', style: 'secondary' },
  { icon: 'MoveHorizontal', title: 'Image Resizer', description: 'Resize images to custom dimensions. Perfect for web, social media, or documents.', category: 'Image', link: '/tools/image-resizer', style: 'outline' },
  { icon: 'Braces', title: 'JSON <> CSV Converter', description: 'Convert JSON files to CSV and vice-versa. Supports nested JSON and file uploads.', category: 'Converter', link: '/tools/json-csv-converter', style: 'outline' },
  { icon: 'Sheet', title: 'CSV <> Excel Converter', description: 'Convert CSV files to Excel (.xlsx) format for better readability and business use.', category: 'Documents', link: '/tools/csv-excel-converter', style: 'primary' },
  { icon: 'Key', title: 'JWT Decoder', description: 'Decode and inspect JSON Web Tokens to view header and payload data securely.', category: 'Security', link: '/tools/jwt-decoder', style: 'outline' },
  { icon: 'FileText', title: 'Markdown to HTML', description: 'Convert Markdown text into clean HTML with a live preview and copy-to-clipboard functionality.', category: 'Converter', link: '/tools/markdown-to-html', style: 'outline' },
  { icon: 'Shield', title: 'Password Generator', description: 'Create strong, secure passwords with custom length and character settings.', category: 'Security', link: '/tools/password-generator', style: 'outline' },
  { icon: 'QrCode', title: 'QR Code Generator', description: 'Generate QR codes from any text or URL. Download a high-quality PNG instantly.', category: 'Utility', link: '/tools/qr-code-generator', style: 'outline' },
  { icon: 'Scan', title: 'QR Code Scanner', description: 'Scan QR codes using your camera or by uploading an image. Details and read code data securely.', category: 'Utility', link: '/tools/qr-code-scanner', style: 'outline' },
  { icon: 'Regex', title: 'Regex Tester', description: 'Test and debug your regular expressions with live matching, groups, and replacements.', category: 'Web', link: '/tools/regex-tester', style: 'secondary' },
  { icon: 'Link', title: 'URL Encoder / Decoder', description: 'Encode or decode strings to be URL-safe. Essential for handling data in URIs.', category: 'Web', link: '/tools/url-encoder', style: 'secondary' },
  { icon: 'Binary', title: 'Base64 Encoder / Decoder', description: 'Convert text or files to and from Base64 encoding for data transmission.', category: 'Converter', link: '/tools/base64-encoder', style: 'primary' },
  { icon: 'Clock', title: 'Unix Timestamp Converter', description: 'Convert Unix timestamps to human-readable dates and vice-versa. Handles seconds and ms.', category: 'Utility', link: '/tools/timestamp-converter', style: 'outline' },
  { icon: 'CaseSensitive', title: 'Case Converter', description: 'Transform text between different formats like camelCase, snake_case, and kebab-case.', category: 'Text', link: '/tools/case-converter', style: 'secondary' },
  { icon: 'Fingerprint', title: 'Hash Generator', description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text or files.', category: 'Security', link: '/tools/hash-generator', style: 'primary' },
  { icon: 'KeyRound', title: 'HMAC Generator', description: 'Create HMAC signatures for verifying data integrity and authenticity.', category: 'Security', link: '/tools/hmac-generator', style: 'secondary' },
  { icon: 'Globe', title: 'My IP Information', description: 'Quickly check your public IP address and related network information.', category: 'Web', link: '/tools/my-ip', style: 'outline' },
  { icon: 'Ticket', title: 'CSRF Token Generator', description: 'Generate secure, random tokens to protect against Cross-Site Request Forgery.', category: 'Security', link: '/tools/csrf-token-generator', style: 'outline' },
  { icon: 'ShieldCheck', title: 'SSL Certificate Checker', description: 'Check a domain\'s SSL certificate for expiry, issuer, and other details.', category: 'Security', link: '/tools/ssl-checker', style: 'primary' },
  { icon: 'Hash', title: 'Number Base Converter', description: 'Convert numbers between Binary, Octal, Decimal, and Hexadecimal systems.', category: 'Converter', link: '/tools/number-base-converter', style: 'secondary' },
  { icon: 'Globe2', title: 'Time Zone Converter', description: 'Find out the time in different cities and countries around the world. Useful for global teams.', category: 'Utility', link: '/tools/time-zone-converter', style: 'primary' },
  { icon: 'Minimize', title: 'Image Compressor', description: 'Reduce image file size with adjustable quality. Supports JPEG and WebP formats.', category: 'Image', link: '/tools/image-compressor', style: 'primary' },
  { icon: 'Camera', title: 'Image Metadata Viewer', description: 'View EXIF data from photos and remove it. Supports GPS, camera model, and more.', category: 'Image', link: '/tools/image-metadata-viewer', style: 'secondary' },
  { icon: 'Wand2', title: 'SVG Optimizer', description: 'Minify SVG code by removing unnecessary data and attributes for smaller file sizes.', category: 'Web', link: '/tools/svg-optimizer', style: 'outline' },
  { icon: 'AppWindow', title: 'Favicon Generator', description: 'Create a complete set of favicons for all devices from a single image.', category: 'Design', link: '/tools/favicon-generator', style: 'primary' },
  { icon: 'Pilcrow', title: 'Lorem Ipsum Generator', description: 'Generate placeholder text in paragraphs, sentences, or words for your designs.', category: 'Text', link: '/tools/lorem-ipsum-generator', style: 'outline' },
  { icon: 'Link2', title: 'Slug Generator', description: 'Create clean, SEO-friendly URL slugs from your page or post titles.', category: 'Web', link: '/tools/slug-generator', style: 'primary' },
  { icon: 'BookOpen', title: 'Word & Character Counter', description: 'Analyze your text for word count, character count, and estimated reading time.', category: 'Text', link: '/tools/word-counter', style: 'secondary' },
  { icon: 'Code', title: 'HTML Entity Encoder/Decoder', description: 'Convert special characters to their HTML entity equivalents and back.', category: 'Text', link: '/tools/html-entity-encoder', style: 'outline' },
  { icon: 'Tags', title: 'SEO Meta Tag Generator', description: 'Generate meta tags for title, description, and Open Graph with live previews.', category: 'Web', link: '/tools/meta-tag-generator', style: 'primary' },
  { icon: 'Bot', title: 'robots.txt Generator', description: 'Create and download a `robots.txt` file to guide search engine crawlers.', category: 'Web', link: '/tools/robots-txt-generator', style: 'secondary' },
  { icon: 'Network', title: 'sitemap.xml Generator', description: 'Generate an XML sitemap from a list of URLs to improve your site\'s SEO.', category: 'Web', link: '/tools/sitemap-xml-generator', style: 'outline' },
  { icon: 'Volume2', title: 'Text to Speech', description: 'Convert text to audio using the Web Speech API with different voices and controls.', category: 'Utility', link: '/tools/text-to-speech', style: 'primary' },
  { icon: 'Droplet', title: 'PDF Watermarker', description: 'Add a text watermark to your PDF files with custom size, color, and opacity.', category: 'Documents', link: '/tools/pdf-watermarker', style: 'primary' },
];

const categories: ToolCategory[] = ['Business', 'Web', 'Security', 'Converter', 'Image', 'Documents', 'Utility', 'Design', 'Text'];

const whyUsItems: { icon: keyof typeof Icons; title: string; description: string }[] = [
    { icon: 'Zap', title: 'Blazing Fast', description: 'All tools run instantly in your browser, with no waiting for uploads or server processing.' },
    { icon: 'ShieldCheck', title: '100% Private', description: 'Your files and data are never sent to a server. Everything stays on your device.' },
    { icon: 'WifiOff', title: 'Works Offline', description: 'After the initial page load, our tools work even without an internet connection.' },
    { icon: 'Gift', title: 'Free & Anonymous', description: 'No signups, no tracking, and no watermarks. Just free, powerful tools for everyone.' },
]

const faqs = [
  { question: "Are these tools really free?", answer: "Yes, absolutely. All tools in our suite are completely free to use. There are no hidden charges, premium features, or usage limits." },
  { question: "Is it safe to use my sensitive files?", answer: "Your security is our top priority. Since all processing happens inside your browser, your files are never uploaded to our servers. This means your data remains private and secure on your own computer." },
  { question: "Do I need to install any software?", answer: "No installation is required. All our tools are web-based and run directly in your browser. Just open the page and start using them instantly." },
  { question: "Do the tools work on mobile devices?", answer: "Yes, our tools are designed to be fully responsive and work seamlessly across all devices, including desktops, tablets, and mobile phones." },
];

const Icon = ({ name, className }: { name: keyof typeof Icons; className?: string }) => {
    const LucideIcon = Icons[name] as React.ElementType;
    if (!LucideIcon) return <Icons.Package className={className} />;
    return <LucideIcon className={className} />;
};


export default function ToolsClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openAccordionItems, setOpenAccordionItems] = useState<string[]>(categories);

  const filteredAndGroupedTools = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filtered = allTools.filter(tool => 
      !searchTerm || 
      tool.title.toLowerCase().includes(lowercasedSearchTerm) || 
      tool.description.toLowerCase().includes(lowercasedSearchTerm)
    );

    if (!searchTerm) {
        return categories.map(category => ({
          category,
          tools: filtered.filter(tool => tool.category === category).sort((a, b) => a.title.localeCompare(b.title)),
        })).filter(group => group.tools.length > 0);
    } else {
        return [{ category: 'Search Results', tools: filtered }];
    }
  }, [searchTerm]);

  useEffect(() => {
    if (searchTerm) {
      setOpenAccordionItems(['Search Results']);
    } else {
      setOpenAccordionItems(categories);
    }
  }, [searchTerm]);


  return (
    <div className="space-y-16">
      {/* Search and Filter */}
      <div className="space-y-6">
        <div className="relative">
          <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for a tool..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-14 pl-12 pr-4 rounded-full text-lg bg-card border-border shadow-sm"
          />
        </div>
         <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map(category => (
                <Button key={category} variant="outline" size="sm" asChild>
                    <a href={`#category-${category.toLowerCase()}`}>{category}</a>
                </Button>
            ))}
         </div>
      </div>

      {/* Tools Grid */}
       <Accordion 
        type="multiple" 
        value={openAccordionItems}
        onValueChange={setOpenAccordionItems}
        className="space-y-8"
       >
        {filteredAndGroupedTools.map(({ category, tools }) => (
            <AccordionItem key={category} value={category} id={`category-${category.toLowerCase()}`} className="border-none">
                <AccordionTrigger className="text-2xl font-bold hover:no-underline hover:text-primary transition-colors px-4 py-3 rounded-2xl bg-card border-border">
                  {category}
                </AccordionTrigger>
                <AccordionContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tools.map(tool => (
                          <Card key={tool.title} className={cn(
                            "group overflow-hidden rounded-2xl flex flex-col transition-all duration-300 hover:-translate-y-2",
                            {
                              'bg-card border-border': tool.style === 'outline',
                              'bg-accent text-accent-foreground border-accent-foreground/20': tool.style === 'secondary',
                              'gradient-primary text-primary-foreground border-transparent': tool.style === 'primary'
                            }
                          )}>
                            <CardContent className="p-6 flex-grow flex flex-col">
                              <div className="flex justify-between items-start mb-4">
                                <div className={cn(
                                  "w-12 h-12 rounded-lg flex items-center justify-center",
                                  {
                                    'bg-primary/10 text-primary': tool.style === 'outline',
                                    'bg-accent-foreground/10 text-accent-foreground': tool.style === 'secondary',
                                    'bg-primary-foreground/20 text-primary-foreground': tool.style === 'primary'
                                  }
                                )}>
                                  <Icon name={tool.icon} className="w-6 h-6" />
                                </div>
                                <div className={cn(
                                  "px-2 py-0.5 rounded-full text-xs font-medium",
                                  {
                                    'bg-secondary text-secondary-foreground': tool.style === 'outline',
                                     'bg-accent-foreground/10 text-accent-foreground': tool.style === 'secondary',
                                    'bg-primary-foreground/20 text-primary-foreground': tool.style === 'primary'
                                  }
                                )}>
                                  {tool.category}
                                </div>
                              </div>
                              <h3 className="text-xl font-bold mb-2">{tool.title}</h3>
                              <p className={cn("text-sm flex-grow", {
                                'text-muted-foreground': tool.style === 'outline',
                                'text-accent-foreground/80': tool.style === 'secondary',
                                'text-primary-foreground/80': tool.style === 'primary'
                              })}>{tool.description}</p>
                              <Button asChild variant="default" className={cn(
                                "w-full mt-6 gap-2 group/btn",
                                 {
                                    'bg-primary text-primary-foreground hover:bg-primary/90': tool.style === 'outline',
                                    'bg-accent-foreground text-accent hover:bg-accent-foreground/90': tool.style === 'secondary',
                                    'bg-primary-foreground text-primary hover:bg-primary-foreground/90': tool.style === 'primary'
                                  }
                              )}>
                                <Link href={tool.link}>
                                  Open Tool <Icons.ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                </Link>
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
        ))}
       </Accordion>

       {filteredAndGroupedTools.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Icons.SearchX className="mx-auto w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold">No Tools Found</h3>
            <p>Try adjusting your search term.</p>
          </div>
        )}

      {/* Why Us Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Use Our Tools?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {whyUsItems.map(item => (
            <div key={item.title} className="text-center p-6 bg-card border-border rounded-2xl">
              <div className="inline-block p-4 bg-primary/10 text-primary rounded-xl mb-4">
                  <Icon name={item.icon} className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy-First Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto text-center p-8 bg-card border-border rounded-3xl">
          <h2 className="text-3xl font-bold mb-4">Privacy-First By Design</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Unlike other online tools that upload your files to their servers, our suite operates entirely within your browser. This client-side approach means your sensitive data—whether it's a personal photo, a confidential document, or a business plan—never leaves your computer. This eliminates privacy risks, data leaks, and wait times for uploads, offering you peace of mind and unparalleled speed. It's the modern, secure way to get things done online.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
         <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
         <div className="max-w-3xl mx-auto">
             <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="bg-card border border-border rounded-2xl px-6 data-[state=open]:border-primary/50 data-[state=open]:shadow-red transition-all duration-300"
                >
                    <AccordionTrigger className="text-left font-semibold hover:text-primary transition-colors py-6 [&[data-state=open]>svg]:text-primary">
                    {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                    {faq.answer}
                    </AccordionContent>
                </AccordionItem>
                ))}
            </Accordion>
         </div>
      </section>

    </div>
  );
}
