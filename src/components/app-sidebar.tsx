'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
  NotificationsContent, 
  colorThemes, 
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ThemeToggle } from '@/components/theme-toggle';
import { BackButton } from '@/components/back-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'; 
import { format } from 'date-fns';
import {
  Home,
  CalendarDays,
  Users,
  University,
  Info,
  Mail,
  Sparkles,
  Palette,
  Globe,
  Smartphone,
  Code,
  Cpu,
  ShieldCheck,
  BrainCircuit,
  PanelLeftOpen,
  PanelRightOpen,
  Trophy,
  User,
  Bell,
  ArrowLeft,
  MapPin,
  X, 
  Check, 
  Paintbrush, 
  LayoutDashboard, 
  MessageSquare, 
  Presentation, 
  BarChart3, 
  BookOpenText, 
  BookUser, // Icon for Professor Dashboard
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import ProfileSidebarContent from '@/components/profile-sidebar-content';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet'; 
import { ScrollArea } from '@/components/ui/scroll-area'; 
import { useTheme } from 'next-themes';


const sidebarNavItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/events', label: 'Events', icon: CalendarDays },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
  { href: '/sub-orgs', label: 'Sub-orgs', icon: University },
  { href: '/membership', label: 'Membership', icon: Users },
  { href: '/courses', label: 'Courses', icon: BookOpenText },
  { href: '/forums', label: 'Forums', icon: MessageSquare },
  { href: '/project-showcase', label: 'Project Showcase', icon: Presentation },
  { href: '/achievement-leaderboard', label: 'Leaderboard', icon: BarChart3 },
  { href: '/about', label: 'About', icon: Info },
  { href: '/contact', label: 'Contact', icon: Mail },
  { href: '/admin', label: 'Admin Dashboard', icon: LayoutDashboard },
  { href: '/professor-dashboard', label: 'Professor Dashboard', icon: BookUser }, // New link
];


export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme(); 
  const {
      toggleSidebar,
      state: sidebarState,
      isMobile,
      expandSidebar,
      collapseSidebar,
      sidebarView, 
      setSidebarView, 
      isProfileSheetOpen, 
      setProfileSheetOpen, 
  } = useSidebar();
  const isCollapsed = sidebarState === 'collapsed';

  const ToggleIcon = isCollapsed ? PanelRightOpen : PanelLeftOpen;
  const toggleTooltip = isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar';
  const toggleLabel = isCollapsed ? 'Expand' : 'Collapse';

    const handleThemeChange = (newThemeClass: string) => {
        colorThemes.forEach(t => document.documentElement.classList.remove(t.className));
        document.documentElement.classList.add(newThemeClass);
        localStorage.setItem('colorTheme', newThemeClass);
        setCurrentThemeClass(newThemeClass);
    };

    const [currentThemeClass, setCurrentThemeClass] = useState('theme-default');
    useEffect(() => {
        const savedTheme = localStorage.getItem('colorTheme') || 'theme-default';
        setCurrentThemeClass(savedTheme);
         colorThemes.forEach(t => document.documentElement.classList.remove(t.className));
         document.documentElement.classList.add(savedTheme);
    }, []);


   const handleToggleSidebar = () => {
      const willCollapse = !isCollapsed;
      if (willCollapse && (sidebarView === 'notifications')) {
          setSidebarView('menu');
      }
       if (willCollapse && isProfileSheetOpen) {
          setProfileSheetOpen(false);
       }
      toggleSidebar();
   };

   const sidebarToggleButton = (
     <Button
       variant="ghost"
       size={(isCollapsed && !isMobile) ? "icon" : "default"} 
       onClick={handleToggleSidebar}
       className={cn("w-full justify-start", { "justify-center": isCollapsed && !isMobile })}
       aria-label={toggleTooltip}
     >
       <ToggleIcon className="h-[1.2rem] w-[1.2rem]" />
       <span className={cn('ml-2', { 'hidden': isCollapsed && !isMobile })}>
         {toggleLabel}
       </span>
     </Button>
   );


    const sidebarToggleButtonWithTooltip = (
       <Tooltip>
           <TooltipTrigger asChild>
                {sidebarToggleButton}
           </TooltipTrigger>
           <TooltipContent side="right" align="center">
               {toggleTooltip}
           </TooltipContent>
       </Tooltip>
   );

   const handleBackToMenu = () => {
       setSidebarView('menu');
   };

   const backToMenuButton = (
     <Button
       variant="ghost"
       size={(isCollapsed && !isMobile) ? "icon" : "default"} 
       onClick={handleBackToMenu}
       className={cn("w-full justify-start", { "justify-center": isCollapsed && !isMobile })} 
       aria-label="Back to Menu"
     >
       <ArrowLeft className="h-[1.2rem] w-[1.2rem]" />
        <span className={cn('ml-2', { 'hidden': isCollapsed && !isMobile })}>
         Back
       </span>
     </Button>
   );


    const backToMenuButtonWithTooltip = (
       <Tooltip>
           <TooltipTrigger asChild>
                {backToMenuButton}
           </TooltipTrigger>
           <TooltipContent side="right" align="center">
               Back to Menu
           </TooltipContent>
       </Tooltip>
   );

    const handleProfileClick = (e: React.MouseEvent) => {
        setSidebarView('menu'); 
        setProfileSheetOpen(true);
    };

    const handleNotificationClick = () => {
        if (isProfileSheetOpen) {
            setProfileSheetOpen(false);
        }
        if (!isMobile && isCollapsed) {
             expandSidebar();
        }
        setSidebarView('notifications');
    }

    let headerContent;
    if (sidebarView === 'menu') {
        headerContent = (
           <div className={cn("flex items-center justify-center gap-2 group flex-shrink-0")}>
             <Image
                src="/CES_Logo2.png"
                alt="CES ANTIPOLO Logo"
                width={32}
                height={32}
                className={cn("icon-rotate-hover flex-shrink-0 h-8 w-8")}
                data-ai-hint="organization logo"
              />
             <span className={cn("font-bold text-lg text-sidebar-foreground whitespace-nowrap", { 'hidden': isCollapsed && !isMobile })}>
               CES ANTIPOLO
             </span>
           </div>
        );
    } else if (sidebarView === 'notifications') {
         headerContent = (
           <div className={cn("flex items-center gap-2", { 'justify-center': isCollapsed && !isMobile })}>
             <Bell className={cn("h-6 w-6 text-sidebar-primary flex-shrink-0", { 'h-8 w-8': isCollapsed && !isMobile })} />
             <span className={cn("font-bold text-lg text-sidebar-foreground whitespace-nowrap", { 'hidden': isCollapsed && !isMobile })}>
                 Notifications
             </span>
           </div>
        );
    }


  return (
    <TooltipProvider>
      
      <Sidebar side="left" collapsible="icon" variant="sidebar">
         <SidebarHeader className={cn("flex items-center justify-center gap-2")}>
             {headerContent}
        </SidebarHeader>

        
        <div className="flex-1 flex flex-col overflow-hidden">
            {sidebarView === 'menu' && (
                <SidebarContent className="flex-1 p-2 overflow-y-auto">
                    <SidebarMenu>
                        {sidebarNavItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                             <Link href={item.href} passHref>
                                <SidebarMenuButton
                                    as="a"
                                    isActive={(pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)))}
                                    tooltip={item.label}
                                    className={cn("btn-hover-scale")}
                                >
                                    <item.icon className="h-[1.2rem] w-[1.2rem] flex-shrink-0" />
                                    <span className={cn({ 'hidden': isCollapsed && !isMobile })}>
                                        {item.label}
                                    </span>
                                </SidebarMenuButton>
                             </Link>
                        </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarContent>
            )}
             {sidebarView === 'notifications' && <NotificationsContent />}
         </div>


         
         <SidebarFooter className="p-2 flex flex-col gap-1 border-t border-sidebar-border">
            
            {sidebarView === 'notifications' && (
                 isCollapsed && !isMobile ? backToMenuButtonWithTooltip : backToMenuButton
            )}

             
             <SidebarMenuButton
                tooltip="Profile"
                onClick={handleProfileClick}
                variant="ghost"
                 isActive={isProfileSheetOpen}
                 className={cn("w-full justify-start", { "justify-center": isCollapsed && !isMobile })}
             >
                <User className="h-[1.2rem] w-[1.2rem] flex-shrink-0" />
                 <span className={cn({ 'hidden': isCollapsed && !isMobile })}>
                     Profile
                 </span>
             </SidebarMenuButton>

             
             <SidebarMenuButton
                tooltip="Notifications"
                onClick={handleNotificationClick}
                variant="ghost"
                 isActive={sidebarView === 'notifications'}
                 className={cn("w-full justify-start", { "justify-center": isCollapsed && !isMobile })}
             >
                <Bell className="h-[1.2rem] w-[1.2rem] flex-shrink-0" />
                 <span className={cn({ 'hidden': isCollapsed && !isMobile })}>
                    Notifications
                 </span>
             </SidebarMenuButton>

            
             <ThemeToggle className={cn("w-full justify-start", { "justify-center": isCollapsed && !isMobile })} />

             
              <DropdownMenu>
                 <Tooltip>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                             <Button variant="ghost" size={(isCollapsed && !isMobile) ? "icon" : "default"} className={cn("w-full justify-start", { "justify-center": isCollapsed && !isMobile })}>
                                <Paintbrush className="h-[1.2rem] w-[1.2rem]" />
                                <span className={cn('ml-2', { 'hidden': isCollapsed && !isMobile })}>
                                    Theme
                                </span>
                             </Button>
                         </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">
                        Change Color Theme
                    </TooltipContent>
                 </Tooltip>
                 <DropdownMenuContent side="right" align="start" className="w-48 max-h-80 overflow-y-auto">
                     <DropdownMenuLabel>Color Theme</DropdownMenuLabel>
                     <DropdownMenuSeparator />
                     {colorThemes.map((colorTheme) => (
                         <DropdownMenuItem
                            key={colorTheme.className}
                             onClick={() => handleThemeChange(colorTheme.className)}
                             className="flex justify-between items-center"
                         >
                             {colorTheme.name}
                             {currentThemeClass === colorTheme.className && <Check className="h-4 w-4 ml-auto" />}
                         </DropdownMenuItem>
                     ))}
                 </DropdownMenuContent>
             </DropdownMenu>
            
             
              {!isMobile && (
                 isCollapsed ? sidebarToggleButtonWithTooltip : sidebarToggleButton
              )}

             <BackButton className={cn("w-full justify-start", { "justify-center": isCollapsed && !isMobile })}/>


         </SidebarFooter>
      </Sidebar>

        
        <Sheet open={isProfileSheetOpen} onOpenChange={setProfileSheetOpen}>
           <SheetContent
               className="w-full sm:max-w-md md:w-[450px] lg:w-[500px] xl:w-[550px] bg-sidebar text-sidebar-foreground p-0 flex flex-col border-l border-sidebar-border" 
              side="left" 
            >
                <SheetHeader className="p-4 border-b border-sidebar-border flex flex-row items-center justify-between">
                  <SheetTitle className="flex items-center gap-2 text-sidebar-foreground">
                      <User className="h-6 w-6 text-sidebar-primary" /> Profile
                  </SheetTitle>
                   <SheetClose asChild>
                       <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:bg-sidebar-accent">
                           <X className="h-5 w-5" />
                           <span className="sr-only">Close Profile</span>
                       </Button>
                   </SheetClose>
                </SheetHeader>
                <ScrollArea className="flex-1">
                   <ProfileSidebarContent />
                </ScrollArea>
           </SheetContent>
        </Sheet>

    </TooltipProvider>
  );
}
