
'use client'; // Required because IndexCardQrGenerator is a client component

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpenText, Info, Database, Network, BarChartHorizontal, ArrowRight } from 'lucide-react'; // Added ArrowRight
import Link from 'next/link';
import IndexCardQrGenerator from '@/components/courses/index-card-qr-generator'; // Import the new component
import { Separator } from '@/components/ui/separator'; // Import Separator

const subjects = [
  {
    slug: 'social-prof-issues-1',
    title: 'Social and Professional Issues 1',
    description: 'Explores the ethical, legal, social, and professional aspects of computing and information technology.',
    icon: Info,
    dataAiHint: 'ethics social professional',
  },
  {
    slug: 'info-management-1',
    title: 'Information Management (1/3)',
    description: 'Introduces fundamental concepts of database systems and information management techniques.',
    icon: Database,
    dataAiHint: 'database information management',
  },
  {
    slug: 'quantitative-methods',
    title: 'Quantitative Method (including Modeling and Simulation)',
    description: 'Covers mathematical and statistical methods for problem-solving, including modeling and simulation.',
    icon: BarChartHorizontal,
    dataAiHint: 'quantitative methods modeling simulation',
  },
  {
    slug: 'cisco-networking-1',
    title: 'Cisco Fundamentals of Networking 1 (3/1)',
    description: 'Provides a comprehensive overview of networking concepts, protocols, and technologies, aligned with Cisco curriculum.',
    icon: Network,
    dataAiHint: 'networking cisco fundamentals',
  },
];

export default function CoursesPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <h1 className="text-4xl font-bold text-center mb-8 flex items-center justify-center gap-3 animate-fadeIn">
        <BookOpenText className="text-accent h-9 w-9" /> Courses
      </h1>
      <p className="text-center text-lg text-muted-foreground mb-12 max-w-3xl mx-auto animate-fadeIn animation-delay-100">
        Browse through some of the key subjects offered within the Computer Studies program. Click on a subject to view details.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {subjects.map((subject, index) => (
          <Link key={subject.slug} href={`/courses/${subject.slug}`} passHref>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-scaleUp h-full flex flex-col cursor-pointer group">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                <subject.icon className="h-8 w-8 text-primary flex-shrink-0" />
                <div className="flex-grow">
                  <CardTitle className="text-xl">{subject.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-foreground/80 leading-relaxed">
                  {subject.description}
                </CardDescription>
              </CardContent>
              <CardContent className="pt-0 text-right">
                <ArrowRight className="h-5 w-5 text-muted-foreground inline-block ml-auto group-hover:text-primary transition-colors" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
       <p className="text-xs text-muted-foreground text-center mt-8">* Subject list is a sample. For official course details, please refer to the academic department.</p>
      
      <Separator className="my-12" />

      <IndexCardQrGenerator />

    </div>
  );
}
