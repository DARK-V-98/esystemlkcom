"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, QrCode, CheckCircle2, Zap, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function EBOTSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const features = [
    {
      icon: <div className="w-12 h-12 relative flex items-center justify-center">
              <Image 
                src="/whatsapp.png" 
                alt="WhatsApp" 
                width={48} 
                height={48} 
                className="object-contain"
              />
            </div>,
      title: "WhatsApp Automation",
      description: "Automated instant replies for your business customers on WhatsApp.",
    },
    {
      icon: <LayoutDashboard className="w-8 h-8 text-blue-500" />,
      title: "Business Dashboard",
      description: "Complete control panel for owners and management to track interactions.",
    },
    {
      icon: <QrCode className="w-8 h-8 text-purple-500" />,
      title: "QR Linking",
      description: "Seamlessly link your WhatsApp account with a simple QR scan.",
    },
  ];

  return (
    <section className="relative w-full py-24 overflow-hidden bg-black text-white">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="container relative mx-auto px-4 md:px-6 z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col items-center text-center space-y-6 md:space-y-8 mb-12 md:mb-16"
        >
          <motion.div variants={itemVariants}>
            <Badge variant="outline" className="px-3 py-1 md:px-4 md:py-1.5 border-blue-500/50 text-blue-400 bg-blue-500/10 backdrop-blur-md rounded-full mb-4 md:mb-6">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 mr-2" /> New Release: EBOT 2.1
            </Badge>
            <h2 className="font-headline text-3xl md:text-6xl font-bold tracking-tighter mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-400 to-purple-500">
              Transform Your Business with <br className="hidden md:block" /> WhatsApp Intelligence
            </h2>
            <p className="max-w-[800px] text-gray-400 text-base md:text-xl/relaxed lg:text-2xl/relaxed font-light mx-auto px-4 md:px-0">
              Our advanced WhatsApp automation tool EBOT 2.1 empowers business owners with instant replies and a powerful management dashboard.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto px-6 sm:px-0">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-6 text-lg font-medium shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all hover:scale-105 w-full sm:w-auto">
              Get Started with EBOT
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5 text-white rounded-full px-8 py-6 text-lg font-medium backdrop-blur-md transition-all hover:scale-105 w-full sm:w-auto">
              Watch Demo
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
            >
              <Card className="h-full bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-colors rounded-3xl overflow-hidden group">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="p-4 rounded-2xl bg-black/40 mb-6 border border-white/5 group-hover:border-blue-500/30 transition-colors shadow-inner">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors">{feature.title}</h3>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Dynamic Preview Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 md:mt-24 relative p-6 md:p-12 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-[2rem] md:rounded-[3rem] border border-white/10 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-full h-full bg-[url('/grid.svg')] opacity-20 pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-4 md:space-y-6">
              <h3 className="text-2xl md:text-4xl font-bold text-white">Advanced Dashboard Control</h3>
              <p className="text-gray-400 text-base md:text-xl">
                Manage every interaction from a single, centralized hub. Monitor real-time status, manage multiple sessions, and get detailed analytics on customer engagement.
              </p>
              <ul className="space-y-3 md:space-y-4">
                {[
                  "Real-time QR session management",
                  "Automated message scheduling",
                  "Advanced analytics and reporting",
                  "Secure business data encryption"
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-300 text-sm md:text-base">
                    <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 mr-3 text-green-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative group w-full overflow-hidden">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-black rounded-2xl border border-white/10 p-2 md:p-4 shadow-2xl overflow-hidden aspect-[16/10] sm:aspect-auto sm:h-[300px] md:h-[400px] lg:aspect-[16/10]">
                 {/* Dashboard Mockup Content */}
                 <div className="flex h-full flex-col">
                   <div className="h-8 border-b border-white/10 flex items-center px-4 space-x-2">
                     <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                     <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                     <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                     <div className="flex-grow" />
                     <div className="text-[10px] text-white/30 font-mono">EBOT_ADMIN_V2.1</div>
                   </div>
                   <div className="flex-grow p-4 grid grid-cols-4 gap-4">
                     <div className="col-span-1 border-r border-white/10 space-y-3 pr-4">
                       <div className="h-4 bg-white/5 rounded w-full" />
                       <div className="h-4 bg-blue-500/20 rounded w-3/4" />
                       <div className="h-4 bg-white/5 rounded w-full" />
                       <div className="h-4 bg-white/5 rounded w-full" />
                     </div>
                     <div className="col-span-3 space-y-4">
                       <div className="grid grid-cols-3 gap-3">
                         <div className="h-16 bg-white/5 rounded-xl flex items-center justify-center border border-white/5">
                            <Zap className="w-6 h-6 text-yellow-500/50" />
                         </div>
                         <div className="h-16 bg-white/5 rounded-xl flex items-center justify-center border border-white/5">
                            <Shield className="w-6 h-6 text-blue-500/50" />
                         </div>
                         <div className="h-16 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                            <QrCode className="w-6 h-6 text-blue-400" />
                         </div>
                       </div>
                       <div className="h-32 bg-white/5 rounded-xl border border-white/5 p-4 relative overflow-hidden">
                         <div className="h-2 w-full bg-white/5 rounded mb-4" />
                         <div className="h-2 w-3/4 bg-white/5 rounded mb-4" />
                         <div className="h-2 w-1/2 bg-white/5 rounded mb-4" />
                         <div className="absolute bottom-4 right-4 text-blue-400 text-xs font-mono">Syncing...</div>
                       </div>
                     </div>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
