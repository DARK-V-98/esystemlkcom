
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Client Testimonials",
  description: "Read what our clients have to say about working with ESYSTEMLK and the impact our software solutions have had on their businesses.",
};

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarRating } from "@/components/StarRating";

const testimonials = [
  {
    name: "John Doe",
    title: "CEO, Innovate Inc.",
    review: "ESYSTEMLK built exactly what we needed and got it done on time. The team knew what they were doing and didn't waste our time. Would work with them again without hesitation.",
    avatar: "https://placehold.co/100x100.png",
    hint: "happy client",
    rating: 5,
  },
  {
    name: "Jane Smith",
    title: "Founder, StartupX",
    review: "They listened to what we actually wanted instead of pushing their own ideas. The end result matched our vision and the communication throughout was solid.",
    avatar: "https://placehold.co/100x100.png",
    hint: "business woman",
    rating: 5,
  },
  {
    name: "David Chen",
    title: "CTO, Tech Solutions",
    review: "Strong technical team. They handled some tricky integrations without drama and the system has been running without issues since launch.",
    avatar: "https://placehold.co/100x100.png",
    hint: "tech executive",
    rating: 4.5,
  },
  {
    name: "Maria Garcia",
    title: "Product Manager, Creative Co.",
    review: "The design came out better than I expected and users picked it up straight away. They clearly put thought into how real people would use it.",
    avatar: "https://placehold.co/100x100.png",
    hint: "product manager",
    rating: 5,
  },
  {
    name: "Samuel Jones",
    title: "VP of Engineering, Global Net",
    review: "ESYSTEMLK helped us modernize our infrastructure and the results were immediate. Deployments are faster and we've had far fewer incidents since the migration.",
    avatar: "https://placehold.co/100x100.png",
    hint: "software engineer",
    rating: 4.5,
  },
  {
    name: "Lisa Wong",
    title: "Marketing Director, Fusion M.",
    review: "The app launched on schedule and customers love it. The team was easy to reach, took feedback well, and delivered something we're genuinely proud of.",
    avatar: "https://placehold.co/100x100.png",
    hint: "marketing professional",
    rating: 5,
  }
];

export default function TestimonialsPage() {
  return (
    <>
      <section className="w-full py-20 md:py-28 bg-white text-black">
        <div className="container mx-auto px-4 md:px-6 text-center bg-gray-100 border-gray-200  border border-gray-200 shadow-2xl rounded-3xl py-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Client Testimonials</h1>
          <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl mt-4">
            Hear from our satisfied clients about their experience working with us.
          </p>
        </div>
      </section>
      
      <section className="w-full pb-20 md:pb-28 bg-white text-black">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="p-6 flex flex-col bg-gray-100 border-gray-200  border border-gray-200 hover:border-white/30 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-2">
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
                  <blockquote className="text-foreground/80 italic text-sm flex-grow">
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




