
'use client';

import { User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8 flex items-center justify-center gap-3 animate-fadeIn">
        <User className="text-accent h-9 w-9" /> Profile
      </h1>

      <Card className="shadow-xl animate-scaleUp">
        <CardHeader>
            <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            View and edit your profile information by clicking the 'Profile' button in the sidebar.
          </p>
           {/* Content is now primarily handled within the ProfileSidebarContent component */}
        </CardContent>
      </Card>
    </div>
  );
}
