
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen } from "lucide-react";
import { SiNextdotjs } from "@icons-pack/react-simple-icons";
import Link from "next/link";
import Image from "next/image";

const courses = [
  {
    icon: SiNextdotjs,
    title: "Next.js Foundations",
    description: "Learn how to build a full-stack web application from the ground up with the Next.js App Router.",
    link: "/courses/nextjs",
    image: "/nj.jpg",
    hint: "Next.js logo",
  },
];

export default function CoursesPage() {
  return (
    <>
      <section className="w-full py-20 md:py-28 bg-white text-black">
        <div className="container mx-auto px-4 md:px-6 text-center bg-gray-100 border-gray-200  border border-gray-200 shadow-2xl rounded-3xl py-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Courses</h1>
          <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl mt-4">
            Deepen your knowledge with our free, in-depth courses.
          </p>
        </div>
      </section>
      
      <section className="w-full pb-20 md:pb-28 bg-white text-black">
        <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course) => {
                  const Icon = course.icon;
                  return (
                    <Link href={course.link} key={course.title} className="block group">
                       <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-card border-border hover:border-primary rounded-2xl shadow-lg">
                            <div className="overflow-hidden">
                                <Image
                                    src={course.image}
                                    alt={course.title}
                                    width={600}
                                    height={400}
                                    className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                                    data-ai-hint={course.hint}
                                />
                            </div>
                            <CardContent className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center gap-3 mb-3">
                                  <Icon className="w-8 h-8 text-primary" />
                                  <h3 className="font-headline text-xl font-semibold group-hover:text-primary">{course.title}</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4 flex-grow">
                                    {course.description}
                                </p>
                                <div className="text-sm text-primary font-semibold flex items-center gap-2 mt-auto">
                                    Start Learning <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </div>
                            </CardContent>
                       </Card>
                    </Link>
                  )
                })}
            </div>
        </div>
      </section>
    </>
  );
}




