
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Client Testimonials",
  description: "Read what our clients have to say about working with ESystemLk and the impact our software solutions have had on their businesses.",
};

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarRating } from "@/components/StarRating";

const testimonials = [
  {
    name: "John Doe",
    title: "CEO, Innovate Inc.",
    review: "ESystemLk delivered a game-changing product for us. Their expertise and dedication are unmatched. Highly recommended for any tech needs. The project was completed on time and on budget.",
    avatar: "https://placehold.co/100x100.png",
    hint: "happy client",
    rating: 5,
  },
  {
    name: "Jane Smith",
    title: "Founder, StartupX",
    review: "Working with the ESystemLk team was a fantastic experience. They understood our vision and brought it to life with precision and creativity. Their communication was excellent throughout.",
    avatar: "https://placehold.co/100x100.png",
    hint: "business woman",
    rating: 5,
  },
  {
    name: "David Chen",
    title: "CTO, Tech Solutions",
    review: "The level of technical proficiency at ESystemLk is top-tier. They tackled complex challenges with ease and provided robust, scalable solutions that have significantly improved our operations.",
    avatar: "https://placehold.co/100x100.png",
    hint: "tech executive",
    rating: 4.5,
  },
  {
    name: "Maria Garcia",
    title: "Product Manager, Creative Co.",
    review: "I was impressed by their commitment to user experience. The final product was not only functional but also beautifully designed and intuitive for our users. A truly professional team.",
    avatar: "https://placehold.co/100x100.png",
    hint: "product manager",
    rating: 5,
  },
  {
    name: "Samuel Jones",
    title: "VP of Engineering, Global Net",
    review: "ESystemLk's cloud and DevOps services were instrumental in modernizing our infrastructure. We've seen a massive improvement in deployment speed and system reliability.",
    avatar: "https://placehold.co/100x100.png",
    hint: "software engineer",
    rating: 4.5,
  },
  {
    name: "Lisa Wong",
    title: "Marketing Director, Fusion M.",
    review: "They developed a mobile app that exceeded all our expectations and has been a huge hit with our customers. The team was responsive, agile, and a pleasure to work with.",
    avatar: "https://placehold.co/100x100.png",
    hint: "marketing professional",
    rating: 5,
  }
];

export default function TestimonialsPage() {
  return (
    <>
      <section className="w-full py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6 text-center bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl py-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Client Testimonials</h1>
          <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl mt-4">
            Hear from our satisfied clients about their experience working with us.
          </p>
        </div>
      </section>
      
      <section className="w-full pb-20 md:pb-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="p-6 flex flex-col bg-black/30 backdrop-blur-lg border border-white/10 hover:border-white/30 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-0 flex flex-col flex-grow">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-14 w-14 mr-4 border-2 border-primary">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.hint} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-headline font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <StarRating rating={testimonial.rating} />
                  </div>
                  <blockquote className="text-muted-foreground italic text-sm flex-grow">
                    "{testimonial.review}"
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
