
'use client';

import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { PanelLeftOpen, Bell } from 'lucide-react'; // Removed Search icon
import AccessibilityTools from './accessibility-tools'; // Import the new component

export default function AppHeader() {
  const isMobile = useIsMobile();
  const { toggleSidebar, isMobile: sidebarIsMobile, setSidebarView } = useSidebar(); // Get setSidebarView

  // Function to handle notification click from header
  const handleNotificationClick = () => {
      setSidebarView('notifications');
      // Ensure the mobile sidebar is opened if it's not already
      if (isMobile) {
          toggleSidebar(); // This will open if closed, or do nothing if already open
      }
  }


  return (
    // Use md:hidden to hide on medium and larger screens where sidebar is handled differently
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background px-4 md:hidden gap-2">
       {/* Always show trigger on mobile header */}
      <SidebarTrigger />

      <div className="flex items-center gap-2">
        {/* Accessibility Tools Button */}
        <AccessibilityTools />

        {/* Notification Button */}
        <Button variant="ghost" size="icon" aria-label="Notifications" onClick={handleNotificationClick}>
           <Bell className="h-5 w-5" />
           <span className="sr-only">Notifications</span>
        </Button>
      </div>
    </header>
  );
}
