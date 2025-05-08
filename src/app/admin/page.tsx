'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Newspaper, CalendarDays, Trophy, Users, UserCheck, DollarSign, BarChart2, Network, Mail } from 'lucide-react'; // Added Mail
import AdminNewsManagement from '@/components/admin/admin-news-management';
import AdminEventsManagement from '@/components/admin/admin-events-management';
import AdminAchievementsManagement from '@/components/admin/admin-achievements-management';
import AdminUserManagement from '@/components/admin/admin-user-management';
import AdminMembershipManagement from '@/components/admin/admin-membership-management';
import AdminAnalytics from '@/components/admin/admin-analytics';
import AdminSubOrgManagement from '@/components/admin/admin-suborg-management';
import AdminFinanceManagement from '@/components/admin/admin-finance-management';
// Import placeholders for future components if needed
// import AdminCms from '@/components/admin/admin-cms';
// import AdminEmailSystem from '@/components/admin/admin-email-system';

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8 flex items-center justify-center gap-3 animate-fadeIn">
        <LayoutDashboard className="text-accent h-9 w-9" /> Admin Dashboard
      </h1>

      <Tabs defaultValue="content" className="w-full animate-fadeIn animation-delay-100">
         <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 h-auto mb-6"> {/* Adjusted grid-cols */}
          <TabsTrigger value="content" className="flex flex-col sm:flex-row items-center gap-1.5 py-2">
            <Newspaper className="h-4 w-4 sm:mr-1"/> Content
          </TabsTrigger>
          <TabsTrigger value="users" className="flex flex-col sm:flex-row items-center gap-1.5 py-2">
            <Users className="h-4 w-4 sm:mr-1"/> Users & Roles
          </TabsTrigger>
          <TabsTrigger value="membership" className="flex flex-col sm:flex-row items-center gap-1.5 py-2">
            <UserCheck className="h-4 w-4 sm:mr-1"/> Membership
          </TabsTrigger>
           <TabsTrigger value="finance" className="flex flex-col sm:flex-row items-center gap-1.5 py-2">
             <DollarSign className="h-4 w-4 sm:mr-1"/> Finance
           </TabsTrigger>
           <TabsTrigger value="suborgs" className="flex flex-col sm:flex-row items-center gap-1.5 py-2">
             <Network className="h-4 w-4 sm:mr-1"/> Sub-Orgs
           </TabsTrigger>
           <TabsTrigger value="analytics" className="flex flex-col sm:flex-row items-center gap-1.5 py-2">
              <BarChart2 className="h-4 w-4 sm:mr-1"/> Analytics
           </TabsTrigger>
            {/* Add trigger for future Email system */}
           <TabsTrigger value="email" className="flex flex-col sm:flex-row items-center gap-1.5 py-2">
              <Mail className="h-4 w-4 sm:mr-1"/> Email
           </TabsTrigger>
        </TabsList>

        {/* Content Management Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card className="shadow-md animate-scaleUp">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Newspaper className="h-5 w-5 text-primary"/> News Management</CardTitle>
              <CardDescription>Add, edit, or delete news articles and announcements. (Full CMS planned)</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminNewsManagement />
            </CardContent>
          </Card>
          <Card className="shadow-md animate-scaleUp animation-delay-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-primary"/> Events Management</CardTitle>
               <CardDescription>Create, update, remove events. (Event Registration System planned)</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminEventsManagement />
            </CardContent>
          </Card>
           <Card className="shadow-md animate-scaleUp animation-delay-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-primary"/> Achievements Management</CardTitle>
                <CardDescription>Manage and showcase member and sub-organization achievements.</CardDescription>
              </CardHeader>
              <CardContent>
                 <AdminAchievementsManagement />
              </CardContent>
           </Card>
           {/* Placeholder for robust CMS */}
           <Card className="shadow-md animate-scaleUp animation-delay-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><LayoutDashboard className="h-5 w-5 text-primary"/> Full CMS (Planned)</CardTitle>
                   <CardDescription>A more comprehensive content management system is planned (Backend: Java/Python API).</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Interface TBD. Requires backend API for content CRUD, image handling, and layout management.</p>
                </CardContent>
             </Card>
            {/* Placeholder for Event Registration System */}
           <Card className="shadow-md animate-scaleUp animation-delay-400">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-primary"/> Event Registration System (Planned)</CardTitle>
                 <CardDescription>Manage event sign-ups, track attendance, and handle payments if needed (Backend: Java/Python API).</CardDescription>
              </CardHeader>
              <CardContent>
                  <p className="text-muted-foreground">Interface TBD. Requires backend API for registration logic, user linking, and payment processing.</p>
              </CardContent>
           </Card>
        </TabsContent>

        {/* User & Role Management Tab */}
        <TabsContent value="users">
           <Card className="shadow-md animate-scaleUp">
              <CardHeader>
                 <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary"/> User & Role Management (RBAC)</CardTitle>
                 <CardDescription>View users, manage roles (Admin, Officer, Member), control account status. (Full RBAC planned - Backend: Java/Python API)</CardDescription>
              </CardHeader>
              <CardContent>
                 <AdminUserManagement />
                 <Card className="mt-4 border-dashed">
                    <CardHeader>
                        <CardTitle className="text-base">Role-Based Access Control (Planned)</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <p className="text-muted-foreground text-sm">Granular permission control based on roles (Admin, Officer, Member) requires backend API implementation (e.g., Java Spring Security).</p>
                    </CardContent>
                 </Card>
              </CardContent>
           </Card>
        </TabsContent>

        {/* Membership Management Tab */}
        <TabsContent value="membership">
          <Card className="shadow-md animate-scaleUp">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UserCheck className="h-5 w-5 text-primary"/> Application Review & Payment Verification</CardTitle>
              <CardDescription>Review applications, manage approval status, verify payments. (Streamlined Review System planned - Backend: Java/Python API)</CardDescription>
            </CardHeader>
            <CardContent>
               <AdminMembershipManagement />
            </CardContent>
          </Card>
          {/* Placeholder for Application Review System */}
           <Card className="shadow-md animate-scaleUp animation-delay-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><UserCheck className="h-5 w-5 text-primary"/> Application Review System (Planned)</CardTitle>
                 <CardDescription>A streamlined interface for reviewing and approving membership applications (Backend: Java/Python API).</CardDescription>
              </CardHeader>
              <CardContent>
                  <p className="text-muted-foreground">Interface TBD. Requires backend API to manage application states and link to user accounts.</p>
              </CardContent>
           </Card>
        </TabsContent>

         {/* Finance Management Tab */}
        <TabsContent value="finance">
          <Card className="shadow-md animate-scaleUp">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-primary"/> Finance Management</CardTitle>
              <CardDescription>View payment reports and manage financial details.</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminFinanceManagement />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sub-Org Management Tab */}
        <TabsContent value="suborgs">
            <Card className="shadow-md animate-scaleUp">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Network className="h-5 w-5 text-primary"/> Sub-Organization Management</CardTitle>
                 <CardDescription>View and edit basic sub-organization details. (Leader-specific tools planned - Backend: Java/Python API)</CardDescription>
              </CardHeader>
              <CardContent>
                 <AdminSubOrgManagement />
              </CardContent>
            </Card>
             {/* Placeholder for Sub-Org Leader Tools */}
           <Card className="shadow-md animate-scaleUp animation-delay-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Network className="h-5 w-5 text-primary"/> Sub-Organization Leader Tools (Planned)</CardTitle>
                   <CardDescription>Dedicated tools for sub-org leaders to manage members, events, and announcements (Backend: Java/Python API).</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Interface TBD. Requires backend API with role-specific access for sub-org leaders.</p>
                </CardContent>
             </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
           <Card className="shadow-md animate-scaleUp">
             <CardHeader>
               <CardTitle className="flex items-center gap-2"><BarChart2 className="h-5 w-5 text-primary"/> Analytics Dashboard</CardTitle>
                <CardDescription>Overview of website traffic, member engagement, and revenue metrics. (Comprehensive Dashboard & Automated Reporting planned - Backend: Python API)</CardDescription>
             </CardHeader>
             <CardContent>
                <AdminAnalytics />
             </CardContent>
           </Card>
            {/* Placeholder for Automated Reporting */}
           <Card className="shadow-md animate-scaleUp animation-delay-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart2 className="h-5 w-5 text-primary"/> Automated Reporting (Planned)</CardTitle>
                 <CardDescription>Generate detailed reports on various metrics automatically (Backend: Python API).</CardDescription>
              </CardHeader>
              <CardContent>
                  <p className="text-muted-foreground">Interface TBD. Requires backend API (e.g., Python with Pandas/Celery) to process data and generate reports.</p>
              </CardContent>
           </Card>
           {/* Placeholder for Comprehensive Analytics Dashboard */}
           <Card className="shadow-md animate-scaleUp animation-delay-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart2 className="h-5 w-5 text-primary"/> Comprehensive Analytics Dashboard (Planned)</CardTitle>
                 <CardDescription>A more detailed view of website traffic, user engagement, and other key metrics (Backend: Python API).</CardDescription>
              </CardHeader>
              <CardContent>
                  <p className="text-muted-foreground">Interface TBD. Requires backend API (e.g., Python Flask/Django) to aggregate and serve detailed analytics data.</p>
              </CardContent>
           </Card>
        </TabsContent>


         {/* Placeholder Tab for Email System */}
         <TabsContent value="email">
             <Card className="shadow-md animate-scaleUp">
                 <CardHeader>
                     <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5 text-primary"/> Automated Email System (Planned)</CardTitle>
                     <CardDescription>Configure and manage automated emails (welcome, reminders, etc.). (Planned Backend: Java/Python API)</CardDescription>
                 </CardHeader>
                 <CardContent>
                     <p className="text-muted-foreground">Interface TBD. Requires backend service (e.g., Java Spring Mail or Python Celery with email libraries) to handle email templating and sending.</p>
                 </CardContent>
             </Card>
         </TabsContent>

      </Tabs>
    </div>
  );
}
