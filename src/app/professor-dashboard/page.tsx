
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookUser, BookCopy, Megaphone, ClipboardList, User, Library, ScanLine } from 'lucide-react'; // Added ScanLine for Index
import ProfessorAnnouncementsManagement from '@/components/professor/professor-announcements-management';
import ProfessorActivitiesManagement from '@/components/professor/professor-activities-management';
import ProfessorIndexManagement from '@/components/professor/professor-index-management'; // Import new component

// Mock data for subjects/courses - align with courses page or fetch dynamically
const subjectsData = [
  { slug: 'social-prof-issues-1', title: 'Social and Professional Issues 1' },
  { slug: 'info-management-1', title: 'Information Management (1/3)' },
  { slug: 'quantitative-methods', title: 'Quantitative Method (including Modeling and Simulation)' },
  { slug: 'cisco-networking-1', title: 'Cisco Fundamentals of Networking 1 (3/1)' },
  // Add more courses as needed
];

export default function ProfessorDashboardPage() {
  const [selectedCourseSlug, setSelectedCourseSlug] = useState<string | null>(null);

  const selectedCourse = selectedCourseSlug ? subjectsData.find(s => s.slug === selectedCourseSlug) : null;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8 flex items-center justify-center gap-3 animate-fadeIn">
        <BookUser className="text-accent h-9 w-9" /> Professor Dashboard
      </h1>

      <Tabs defaultValue="course-management" className="w-full animate-fadeIn animation-delay-100">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-4 gap-2 h-auto mb-6"> {/* Adjusted grid-cols for new tab */}
          <TabsTrigger value="course-management" className="flex flex-col sm:flex-row items-center gap-1.5 py-2">
            <BookCopy className="h-4 w-4 sm:mr-1" /> Course Management
          </TabsTrigger>
          <TabsTrigger value="index-cards" className="flex flex-col sm:flex-row items-center gap-1.5 py-2"> {/* New Index Tab Trigger */}
            <ScanLine className="h-4 w-4 sm:mr-1" /> Index Cards
          </TabsTrigger>
          <TabsTrigger value="my-profile" className="flex flex-col sm:flex-row items-center gap-1.5 py-2" disabled>
            <User className="h-4 w-4 sm:mr-1" /> My Profile
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex flex-col sm:flex-row items-center gap-1.5 py-2" disabled>
            <Library className="h-4 w-4 sm:mr-1" /> Resources
          </TabsTrigger>
        </TabsList>

        {/* Course Management Tab */}
        <TabsContent value="course-management" className="space-y-6">
          <Card className="shadow-md animate-scaleUp">
            <CardHeader>
              <CardTitle>Select Course</CardTitle>
              <CardDescription>Choose a course to manage its announcements and activities.</CardDescription>
            </CardHeader>
            <CardContent>
              <Select onValueChange={setSelectedCourseSlug} value={selectedCourseSlug || undefined}>
                <SelectTrigger className="w-full md:w-[300px]">
                  <SelectValue placeholder="Select a course..." />
                </SelectTrigger>
                <SelectContent>
                  {subjectsData.map(subject => (
                    <SelectItem key={subject.slug} value={subject.slug}>
                      {subject.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedCourse && (
            <div className="space-y-6">
              <Card className="shadow-md animate-scaleUp animation-delay-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Megaphone className="h-5 w-5 text-primary" /> Announcements for {selectedCourse.title}</CardTitle>
                  <CardDescription>Create, edit, or delete announcements for this course.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfessorAnnouncementsManagement course={selectedCourse} />
                </CardContent>
              </Card>

              <Card className="shadow-md animate-scaleUp animation-delay-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><ClipboardList className="h-5 w-5 text-primary" /> Activities for {selectedCourse.title}</CardTitle>
                  <CardDescription>Manage assignments, quizzes, and other activities.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfessorActivitiesManagement course={selectedCourse} />
                </CardContent>
              </Card>
            </div>
          )}
          {!selectedCourseSlug && (
            <Card className="border-dashed animate-fadeIn animation-delay-100">
                <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">Please select a course to manage its content.</p>
                </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Index Cards Tab */}
        <TabsContent value="index-cards">
          <ProfessorIndexManagement />
        </TabsContent>

        {/* My Profile Tab (Placeholder) */}
        <TabsContent value="my-profile">
          <Card className="shadow-md animate-scaleUp">
            <CardHeader>
              <CardTitle>My Profile</CardTitle>
              <CardDescription>View and edit your professor profile (Coming Soon).</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Professor profile management will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab (Placeholder) */}
        <TabsContent value="resources">
          <Card className="shadow-md animate-scaleUp">
            <CardHeader>
              <CardTitle>Teaching Resources</CardTitle>
              <CardDescription>Access shared resources and tools for teaching (Coming Soon).</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">A collection of teaching resources will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <p className="text-xs text-muted-foreground text-center mt-8">* This dashboard requires a backend for full functionality. Current features use mock data.</p>
    </div>
  );
}

