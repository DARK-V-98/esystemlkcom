
'use client';
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const fadeOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "CEO, TechStart Inc.",
      content: "ESYSTEMLK rebuilt our website from scratch and the difference was night and day. More leads, faster load times, and the team was easy to work with throughout.",
      rating: 5,
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Founder, GreenLeaf Solutions",
      content: "The software they built cut our admin time in half. Good communication, delivered on time, and they actually fixed a few things we didn't even ask for.",
      rating: 5,
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Marketing Director, BrightFuture Co.",
      content: "The whole process was smooth. They kept us updated, hit the deadline, and the free maintenance means we're not worrying about things breaking down the road.",
      rating: 5,
    },
    {
      id: 4,
      name: "David Perera",
      role: "Owner, Island Restaurants",
      content: "Our online orders went up significantly after the new site launched. The ordering system works without issues and customers keep complimenting how easy it is to use.",
      rating: 5,
    },
  ];

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => clearInterval(interval);
  }, [isAnimating]);

  return (
    <motion.section ref={sectionRef} id="testimonials" style={{ opacity: fadeOpacity }} className="py-24 bg-white text-black relative overflow-hidden animate-fade-in opacity-0">
      <motion.div style={{ y: bgY }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Floating quotes */}
      <Quote className="absolute top-20 left-10 w-24 h-24 text-primary/10 animate-float" />
      <Quote className="absolute bottom-20 right-10 w-32 h-32 text-primary/10 animate-float-delayed rotate-180" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-4">
            <Star className="w-4 h-4" />
            <span>Client Stories</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            What Our <span className="text-gradient">Clients Say</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Real feedback from real clients who trusted us with their digital projects.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Main testimonial card */}
            <div
              className={`bg-card rounded-3xl p-8 md:p-12 shadow-lg border border-border/50 transition-all duration-500 ${
                isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
                      <Quote className="w-8 h-8 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="flex justify-center gap-1 mb-4">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-lg md:text-xl text-foreground/90 mb-6 leading-relaxed">
                    "{testimonials[currentIndex].content}"
                  </p>
                  <div>
                    <h4 className="text-xl font-semibold">{testimonials[currentIndex].name}</h4>
                    <p className="text-gray-600">{testimonials[currentIndex].role}</p>
                  </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={prevSlide}
                className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (isAnimating) return;
                      setIsAnimating(true);
                      setCurrentIndex(index);
                      setTimeout(() => setIsAnimating(false), 500);
                    }}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "w-8 bg-primary"
                        : "bg-muted hover:bg-primary/50"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextSlide}
                className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Testimonials;



