
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with ESYSTEMLK. Whether you have a question about our services or want to start a project, our team is ready to help.",
};

import { ContactForm } from "./contact-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageCircle, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <section className="w-full py-20 md:py-28 bg-white text-black">
        <div className="container mx-auto px-4 md:px-6 text-center bg-gray-100 border-gray-200  border border-gray-200 shadow-2xl rounded-3xl py-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Get in Touch</h1>
          <p className="max-w-[700px] mx-auto text-gray-600 md:text-xl mt-4">
            We'd love to hear from you. Whether you have a question about our services or want to start a project, our team is ready to answer all your questions.
          </p>
        </div>
      </section>
      
      <section className="w-full pb-20 md:pb-28 bg-white text-black">
        <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12">
                <div>
                    <h2 className="font-headline text-3xl font-bold mb-6">Send us a message</h2>
                    <ContactForm />
                </div>
                <div className="space-y-8">
                    <h2 className="font-headline text-3xl font-bold">Contact Information</h2>
                    <Card className="bg-gray-100 border-gray-200  border border-gray-200 rounded-2xl shadow-md">
                        <CardContent className="p-6">
                            <a href="mailto:esystemlk@gmail.com" className="flex items-center gap-4 group">
                                <Mail className="w-8 h-8 text-primary" />
                                <div>
                                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">Email</h3>
                                    <p className="text-gray-600">esystemlk@gmail.com</p>
                                </div>
                            </a>
                        </CardContent>
                    </Card>
                     <Card className="bg-gray-100 border-gray-200  border border-gray-200 rounded-2xl shadow-md">
                        <CardContent className="p-6">
                            <a href="https://wa.me/94765711396" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                                <MessageCircle className="w-8 h-8 text-primary" />
                                <div>
                                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">WhatsApp</h3>
                                    <p className="text-gray-600">+94 76 571 1396</p>
                                </div>
                            </a>
                        </CardContent>
                    </Card>
                    <Card className="bg-gray-100 border-gray-200  border border-gray-200 rounded-2xl shadow-md">
                        <CardContent className="p-6">
                            <a href="tel:+94765711396" className="flex items-center gap-4 group">
                                <Phone className="w-8 h-8 text-primary" />
                                <div>
                                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">Phone</h3>
                                    <p className="text-gray-600">+94 76 571 1396</p>
                                </div>
                            </a>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
      </section>
    </>
  );
}





