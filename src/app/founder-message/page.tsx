
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Quote, Target, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const FounderMessagePage = () => {
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
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      className="container mx-auto px-4 md:px-6 py-20 md:py-28"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="text-center mb-16"
        variants={itemVariants}
      >
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
          A Message from Our Founder
        </h1>
        <p className="max-w-[700px] mx-auto text-white/80 md:text-xl mt-4">
          Meet the mind behind ESystemLk.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-12 items-start">
        <motion.div
          className="lg:col-span-1"
          variants={itemVariants}
        >
          <Card className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl sticky top-28">
            <CardContent className="p-8 text-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image
                  src="/va.jpg"
                  alt="R.M.T. Vishwa Vidarshana, Founder and CEO of ESystemLk"
                  width={400}
                  height={400}
                  className="rounded-full w-48 h-48 mx-auto mb-6 border-4 border-primary shadow-lg object-cover"
                />
              </motion.div>
              <h2 className="font-headline text-2xl font-bold">R.M.T. Vishwa Vidarshana</h2>
              <p className="text-primary font-medium">Founder & CEO</p>
               <Button asChild variant="outline" className="mt-6 w-full">
                  <Link href="/about">Back to About Us</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="lg:col-span-2 space-y-8"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Card className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-3xl shadow-xl">
              <CardContent className="p-8">
                <p className="text-muted-foreground text-lg">
                  R.M.T. Vishwa Vidarshana is the Founder and Chief Executive Officer of eSystemLK, a growing software company representing some of the most skilled developers in Sri Lanka.
                </p>
                <br />
                <p className="text-muted-foreground text-lg">
                  With more than six years of hands-on experience in large-scale system development, web and mobile applications, computer game development, business management, hardware and networking, and cybersecurity, Vishwa brings deep technical knowledge and leadership to every project he undertakes.
                </p>
                <br />
                 <p className="text-muted-foreground text-lg">
                  Throughout his career, he has worked on and led the creation of major government and private-sector systems across Sri Lanka. His portfolio includes advanced web systems, enterprise-level software, and custom-built solutions designed to meet complex business needs.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-3xl shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Quote className="w-6 h-6 text-primary" />
                  <span className="font-headline text-2xl">Guiding Philosophy</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <blockquote className="text-xl italic text-white/90 border-l-4 border-primary pl-6">
                  “Knowledge is the ladder to growth. The more we learn, the further we can climb.”
                </blockquote>
                 <p className="text-muted-foreground mt-4">
                  Guided by this philosophy, eSystemLK continues to grow as a knowledge-driven technology company, bringing together Sri Lanka’s top developers to create world-class digital products and services.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-3xl shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-primary" />
                  <span className="font-headline text-2xl">Vision as a Founder</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground text-lg">
                    Vishwa believes technology should do more than just solve problems — it should empower people and businesses to grow with confidence. His focus is on:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 text-lg">
                  <li>Encouraging continuous learning and innovation within the team.</li>
                  <li>Building secure, scalable, and efficient software solutions.</li>
                  <li>Helping Sri Lankan businesses and organizations embrace digital transformation through trusted technology partnerships.</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
          
           <motion.div variants={itemVariants}>
            <Card className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-3xl shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-primary" />
                   <span className="font-headline text-2xl">Message from the Founder</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <blockquote className="text-xl italic text-white/90">
                  “eSystemLK is more than a company; it’s a group of passionate individuals who believe in creating meaningful technology. Our goal is to lift Sri Lanka’s software industry to global standards through quality, creativity, and genuine dedication.”
                </blockquote>
              </CardContent>
            </Card>
          </motion.div>

        </motion.div>
      </div>
    </motion.div>
  );
};

export default FounderMessagePage;
