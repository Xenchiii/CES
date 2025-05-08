
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpenText, Info, Database, Network, BarChartHorizontal, ArrowLeft, Megaphone, BookCopy, CalendarDays, ClipboardList, Users, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Re-define subjects data here or import from a shared location
// For simplicity, redefining here. In a real app, this would likely come from a DB or shared lib.
const subjectsData = [
  {
    slug: 'social-prof-issues-1',
    title: 'Social and Professional Issues 1',
    description: 'Explores the ethical, legal, social, and professional aspects of computing and information technology.',
    icon: Info,
  },
  {
    slug: 'info-management-1',
    title: 'Information Management (1/3)',
    description: 'Introduces fundamental concepts of database systems and information management techniques.',
    icon: Database,
  },
  {
    slug: 'quantitative-methods',
    title: 'Quantitative Method (including Modeling and Simulation)',
    description: 'Covers mathematical and statistical methods for problem-solving, including modeling and simulation.',
    icon: BarChartHorizontal,
  },
  {
    slug: 'cisco-networking-1',
    title: 'Cisco Fundamentals of Networking 1 (3/1)',
    description: 'Provides a comprehensive overview of networking concepts, protocols, and technologies, aligned with Cisco curriculum.',
    icon: Network,
  },
];

interface SubjectDetailPageProps {
  params: { subjectSlug: string };
}

const getSubjectBySlug = (slug: string) => {
  return subjectsData.find(subject => subject.slug === slug);
}

export default function SubjectDetailPage({ params }: SubjectDetailPageProps) {
  const subject = getSubjectBySlug(params.subjectSlug);

  if (!subject) {
    notFound();
  }

  const SubjectIcon = subject.icon || BookOpenText;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Link href="/courses" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors link-underline-grow animate-fadeIn">
        <ArrowLeft className="h-4 w-4" />
        Back to Courses
      </Link>

      <header className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-8 animate-fadeIn animation-delay-100">
        <SubjectIcon className="h-12 w-12 md:h-16 md:w-16 text-primary flex-shrink-0" />
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">{subject.title}</h1>
          <p className="text-md md:text-lg text-muted-foreground mt-1">{subject.description}</p>
        </div>
      </header>

      <Tabs defaultValue="announcements" className="w-full animate-fadeIn animation-delay-200">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 h-auto mb-6">
          <TabsTrigger value="announcements" className="flex-col sm:flex-row items-center gap-1.5 py-2"><Megaphone className="h-4 w-4 sm:mr-1"/>Announcements</TabsTrigger>
          <TabsTrigger value="module" className="flex-col sm:flex-row items-center gap-1.5 py-2"><BookCopy className="h-4 w-4 sm:mr-1"/>Module</TabsTrigger>
          <TabsTrigger value="calendar" className="flex-col sm:flex-row items-center gap-1.5 py-2"><CalendarDays className="h-4 w-4 sm:mr-1"/>Calendar</TabsTrigger>
          <TabsTrigger value="gradebook" className="flex-col sm:flex-row items-center gap-1.5 py-2"><ClipboardList className="h-4 w-4 sm:mr-1"/>Gradebook</TabsTrigger>
          <TabsTrigger value="groups" className="flex-col sm:flex-row items-center gap-1.5 py-2"><Users className="h-4 w-4 sm:mr-1"/>Groups</TabsTrigger>
          <TabsTrigger value="discussion" className="flex-col sm:flex-row items-center gap-1.5 py-2"><MessageSquare className="h-4 w-4 sm:mr-1"/>Discussion</TabsTrigger>
        </TabsList>

        <TabsContent value="announcements">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Announcements</CardTitle>
              <CardDescription>Latest updates and news for {subject.title}.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No announcements posted yet. Check back soon!</p>
              {/* Placeholder for announcements list */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="module">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Module Content</CardTitle>
              <CardDescription>Course materials, lectures, and resources.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Module content for {subject.title} will be available here.</p>
              {/* Placeholder for module content */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Subject Calendar</CardTitle>
              <CardDescription>Important dates, deadlines, and schedules for {subject.title}.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Subject-specific calendar coming soon.</p>
              {/* Placeholder for a subject-specific calendar view */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gradebook">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Gradebook / Activities</CardTitle>
              <CardDescription>View your grades and submitted activities for {subject.title}.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Gradebook and activity tracking is under development.</p>
              {/* Placeholder for gradebook and activities list */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Study Groups</CardTitle>
              <CardDescription>Collaborate with your classmates in study groups for {subject.title}.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Study group functionality coming soon.</p>
              {/* Placeholder for groups list and creation */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discussion">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Discussion Forum</CardTitle>
              <CardDescription>Ask questions and discuss topics related to {subject.title}.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Discussion forum for this subject is under construction.</p>
              {/* Placeholder for subject-specific discussion forum */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <p className="text-xs text-muted-foreground text-center mt-8">* This page provides a sample structure. Official subject details and functionalities are managed by the academic department and Learning Management System (LMS).</p>
    </div>
  );
}

// generateStaticParams to pre-render these pages at build time
export async function generateStaticParams() {
  return subjectsData.map((subject) => ({
    subjectSlug: subject.slug,
  }));
}

// Optional: generateMetadata to set dynamic page titles
export async function generateMetadata({ params }: SubjectDetailPageProps) {
  const subject = getSubjectBySlug(params.subjectSlug);
  if (!subject) {
    return {
      title: "Subject Not Found",
    };
  }
  return {
    title: `${subject.title} | Courses`,
    description: `Details and resources for the course: ${subject.title}.`,
  };
}
