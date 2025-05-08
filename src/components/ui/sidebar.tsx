"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { Paintbrush, PanelLeft, PanelRightOpen, PanelLeftOpen, ArrowLeft, User, Bell, X, Check, Home } from "lucide-react" // Import needed icons

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet" // Added Sheet components
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area" // Added ScrollArea
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card" // Added Card components
import { MapPin } from "lucide-react" // Added MapPin
import { format } from "date-fns" // Added date-fns
import { ThemeToggle } from "@/components/theme-toggle" // Added ThemeToggle
import { BackButton } from "@/components/back-button" // Added BackButton
import Image from "next/image" // Added Image
import ProfileSidebarContent from "@/components/profile-sidebar-content" // Added ProfileSidebarContent
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu" // Added DropdownMenu components


const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3.5rem" // Adjusted for consistent icon button size
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarView = 'menu' | 'notifications'; // Profile handled by Sheet

type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
  expandSidebar: () => void; // Function to force expand
  collapseSidebar: () => void; // Function to force collapse
  sidebarView: SidebarView; // Add current view state
  setSidebarView: (view: SidebarView) => void; // Add function to set view
  isProfileSheetOpen: boolean; // State for profile sheet
  setProfileSheetOpen: (open: boolean) => void; // Setter for profile sheet
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

// Define available color themes (must match globals.css)
const colorThemes = [
    { name: "Default", className: "theme-default" },
    { name: "Ocean", className: "theme-ocean" },
    { name: "Sunset", className: "theme-sunset" },
    { name: "Forest", className: "theme-forest" },
    { name: "Desert", className: "theme-desert" },
    { name: "Mountain", className: "theme-mountain" },
    { name: "Autumn", className: "theme-autumn" },
    { name: "Winter", className: "theme-winter" },
    { name: "Tropical", className: "theme-tropical" },
    { name: "Lavender", className: "theme-lavender" },
    { name: "Urban", className: "theme-urban" },
    { name: "Meadow", className: "theme-meadow" },
    { name: "Galaxy", className: "theme-galaxy" },
    { name: "Rainforest", className: "theme-rainforest" },
    { name: "Vintage", className: "theme-vintage" },
    { name: "Ice Cream", className: "theme-icecream" },
    { name: "Candlelit", className: "theme-candlelit" },
    { name: "Seaside", className: "theme-seaside" },
    { name: "Wildflower", className: "theme-wildflower" },
    { name: "Crimson", className: "theme-crimson" },
];


// Mock data for upcoming events (similar to events page) - Needs to be outside component for NotificationsContent
const upcomingEventsData = [
    { id: 1, title: 'College of Computer Studies Day (CCS)', date: new Date(2025, 5, 13), endDate: new Date(2025, 5, 14), location: 'ICCT Cainta Campus' },
    { id: 2, title: 'Sports Festival 2025', date: new Date(2025, 5, 20), location: 'Marikina Sports Center' },
    { id: 3, title: 'Final Exam', date: new Date(2025, 5, 26), endDate: new Date(2025, 5, 29), location: 'ICCT Colleges Antipolo Campus' },
];

// Helper to format date ranges for events - Needs to be outside component
const formatDateRange = (start: Date, end?: Date): string => {
    if (end && format(start, 'yyyy-MM-dd') !== format(end, 'yyyy-MM-dd')) {
        return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    }
    return format(start, 'PPP');
};


// Component to display notification content
const NotificationsContent = () => {
     const { state: sidebarState, isMobile, setSidebarView } = useSidebar();
     const isCollapsed = sidebarState === 'collapsed';

      // Safely get notifications from local storage only on the client
      const [notifications, setNotifications] = React.useState<any[]>([]);
      React.useEffect(() => {
         if (typeof window !== 'undefined') {
             const storedNotifications = localStorage.getItem('notifications');
             if (storedNotifications) {
                 try {
                     const parsedNotifications = JSON.parse(storedNotifications);
                     setNotifications(Array.isArray(parsedNotifications) ? parsedNotifications : []);
                 } catch (e) {
                     console.error("Failed to parse notifications from local storage", e);
                     setNotifications([]);
                 }
             } else {
                 setNotifications([]);
             }
         }
      }, []); // Empty dependency array means this runs once on mount


     const sortedEvents = upcomingEventsData
        .filter(event => (event.endDate || event.date) >= new Date(new Date().setHours(0,0,0,0))) // Filter events that end today or later
        .sort((a, b) => a.date.getTime() - b.date.getTime()); // Sort by start date

    // Don't render anything if the sidebar is collapsed on desktop
    if (isCollapsed && !isMobile) {
      return null;
    }

    const hasNotifications = notifications.length > 0 || sortedEvents.length > 0;


  return (
    <ScrollArea className="p-2 space-y-3 overflow-y-auto flex-1">
       {/* Back to Menu Button (only for mobile view inside content) */}
       {/* No back button needed inside the content itself anymore */}

       {/* Payment Notifications */}
        {notifications.length > 0 && notifications.map(notif => (
          <Card key={notif.id} className="bg-card/80 hover:bg-card transition-colors">
            <CardHeader className="p-3">
              <CardTitle className="text-sm font-medium">{notif.title || 'Notification'}</CardTitle>
               <CardDescription className="text-xs text-muted-foreground">
                   {format(new Date(notif.date), 'PPp')} {/* Format date */}
               </CardDescription>
              <CardDescription className="text-xs">{notif.message}</CardDescription>
               {/* Optionally add more details */}
               {/* {notif.details && <CardContent className="p-0 pt-2 text-xs">{JSON.stringify(notif.details)}</CardContent>} */}
            </CardHeader>
          </Card>
        ))}

       {/* Upcoming Events */}
      {sortedEvents.length > 0 ? (
        sortedEvents.map(event => (
          <Card key={event.id} className="bg-card/80 hover:bg-card transition-colors">
            <CardHeader className="p-3">
              <CardTitle className="text-sm font-medium">{event.title}</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Upcoming: {formatDateRange(event.date, event.endDate)}
              </CardDescription>
              <CardDescription className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {event.location}
              </CardDescription>
            </CardHeader>
            {/* Optionally add CardContent for more details */}
          </Card>
        ))
      ) : null}

       {!hasNotifications && (
         <Card className="bg-card/80">
            <CardContent className="pt-4 text-center">
                <p className="text-sm text-muted-foreground">No new notifications or upcoming events.</p>
            </CardContent>
         </Card>
       )}
    </ScrollArea>
  );
};


const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)
    const [_open, _setOpen] = React.useState(defaultOpen)
    const [sidebarView, setSidebarView] = React.useState<SidebarView>('menu'); // Add view state
    const [isProfileSheetOpen, setProfileSheetOpen] = React.useState(false); // Add profile sheet state

     // Initialize state from cookie on mount (client-side only)
     React.useEffect(() => {
       if (typeof window !== 'undefined') {
         const cookieValue = document.cookie
           .split('; ')
           .find(row => row.startsWith(`${SIDEBAR_COOKIE_NAME}=`))
           ?.split('=')[1];
         if (cookieValue !== undefined) {
             _setOpen(cookieValue === 'true');
         }
       }
     }, []);


    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value
        // console.log("setOpen called, new state:", openState); // Debugging
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }

        // Ensure cookie is only set on the client
        if (typeof window !== 'undefined') {
         document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
        }
      },
      [setOpenProp, open]
    )

    const toggleSidebar = React.useCallback(() => {
      // console.log("toggleSidebar called, isMobile:", isMobile); // Debugging
      // Close profile sheet if it's open when toggling main sidebar
      if (isProfileSheetOpen) {
        setProfileSheetOpen(false);
      }

      // If switching to collapsed state and view is not menu, reset view
      const nextOpenState = isMobile ? !openMobile : !open;
      if (!nextOpenState && sidebarView !== 'menu') {
        setSidebarView('menu');
      }

      return isMobile
        ? setOpenMobile((currentOpen) => !currentOpen)
        : setOpen((currentOpen) => !currentOpen);
    }, [isMobile, setOpen, setOpenMobile, isProfileSheetOpen, sidebarView, open, openMobile]) // Added open, openMobile

    const expandSidebar = React.useCallback(() => {
       // console.log("expandSidebar called, isMobile:", isMobile); // Debugging
       if (isMobile) {
         setOpenMobile(true);
       } else {
         setOpen(true);
       }
    }, [isMobile, setOpen, setOpenMobile]);

    const collapseSidebar = React.useCallback(() => {
      // console.log("collapseSidebar called, isMobile:", isMobile); // Debugging
      if (isProfileSheetOpen) { // Close profile sheet if collapsing
          setProfileSheetOpen(false);
      }
      if (sidebarView !== 'menu') { // Reset view if collapsing
        setSidebarView('menu');
      }
      if (isMobile) {
        setOpenMobile(false);
      } else {
        setOpen(false);
      }
    }, [isMobile, setOpen, setOpenMobile, isProfileSheetOpen, sidebarView]);


    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    const state = open ? "expanded" : "collapsed"
    // console.log("SidebarProvider state:", state, "open:", open, "isMobile:", isMobile, "view:", sidebarView, "sheetOpen:", isProfileSheetOpen); // Debugging

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
        expandSidebar,
        collapseSidebar,
        sidebarView, // Pass down view state
        setSidebarView, // Pass down setter for view state
        isProfileSheetOpen, // Pass down profile sheet state
        setProfileSheetOpen, // Pass down setter for profile sheet state
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar, expandSidebar, collapseSidebar, sidebarView, isProfileSheetOpen, setProfileSheetOpen]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right"
    variant?: "sidebar" | "floating" | "inset"
    collapsible?: "offcanvas" | "icon" | "none"
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "icon", // Default to icon collapsible
      className,
      children,
      ...props // The rest of the props are spread
    },
    ref
  ) => {
    // Use context values, not props for mobile state management within the Sidebar component itself
    const { isMobile, state, openMobile, setOpenMobile, open } = useSidebar()
     const currentCollapsible = isMobile ? "offcanvas" : collapsible; // Force offcanvas on mobile
     // console.log("Sidebar component state:", state, "open:", open, "isMobile:", isMobile, "currentCollapsible:", currentCollapsible); // Debugging

    if (currentCollapsible === "none") {
      return (
        <div
          className={cn(
            "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
            className
          )}
          ref={ref}
          {...props} // Spread the remaining props
        >
          {children}
        </div>
      )
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-[--sidebar-width-mobile] bg-sidebar p-0 text-sidebar-foreground flex flex-col" // Use mobile width and flex col
            style={
              {
                "--sidebar-width-mobile": SIDEBAR_WIDTH_MOBILE, // Define mobile width CSS var
              } as React.CSSProperties
            }
            side={side}
            {...props} // Spread props here for SheetContent
          >
             {/* Add SheetHeader and SheetTitle for mobile accessibility */}
             <SheetHeader className="p-4 border-b border-sidebar-border flex flex-row items-center justify-between">
               <SheetTitle className="text-lg font-semibold text-sidebar-foreground">Menu</SheetTitle>
               <SheetClose asChild>
                 <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:bg-sidebar-accent">
                   <X className="h-5 w-5" />
                   <span className="sr-only">Close Menu</span>
                 </Button>
               </SheetClose>
             </SheetHeader>
             {/* Wrap children in a div to allow flex-grow */}
            <div className="flex h-full w-full flex-col overflow-hidden">
                {children}
            </div>
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <div
        ref={ref}
        className="group peer hidden md:block text-sidebar-foreground"
        data-state={state} // Use state derived from 'open' prop
        data-collapsible={state === "collapsed" ? currentCollapsible : ""} // Apply collapsible type when collapsed
        data-variant={variant}
        data-side={side}
      >
        {/* This is what handles the sidebar gap on desktop */}
        <div
          className={cn(
            "duration-200 relative h-svh bg-transparent transition-[width] ease-linear",
            // Adjust width based on state and collapsible type
            state === 'expanded' ? "w-[--sidebar-width]" : "",
            state === 'collapsed' && currentCollapsible === 'icon' ? "w-[--sidebar-width-icon]" : "",
            state === 'collapsed' && currentCollapsible === 'offcanvas' ? "w-0" : "", // Collapse completely for offcanvas
            "group-data-[side=right]:rotate-180", // No change needed here
          )}
        />
         {/* Fixed positioned sidebar */}
        <div
          className={cn(
            "duration-200 fixed inset-y-0 z-10 hidden h-svh transition-[left,right,width] ease-linear md:flex",
            side === "left" ? "left-0" : "right-0",
             // Adjust position and width based on state and collapsible type
             state === 'expanded' ? "w-[--sidebar-width]" : "",
             state === 'collapsed' && currentCollapsible === 'icon' ? "w-[--sidebar-width-icon]" : "",
             state === 'collapsed' && currentCollapsible === 'offcanvas' ? (side === 'left' ? "left-[calc(var(--sidebar-width)*-1)] w-[--sidebar-width]" : "right-[calc(var(--sidebar-width)*-1)] w-[--sidebar-width]") : "",

            // Apply border based on side and variant
            variant === 'sidebar' ? (side === 'left' ? 'border-r border-sidebar-border' : 'border-l border-sidebar-border') : '',
            // Floating/Inset styles (mostly unchanged, adjust padding/width as needed)
             variant === "floating" || variant === "inset"
               ? cn("p-2",
                   state === 'collapsed' && currentCollapsible === 'icon' ? "w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]" : "w-[calc(var(--sidebar-width)_+_theme(spacing.4))]", // Adjust width for floating/inset
                   state === 'collapsed' && currentCollapsible === 'offcanvas' ? "w-0 p-0" : "" // Collapse fully for offcanvas
                 )
               : "", // Apply icon width when collapsed for sidebar variant
            className
          )}
          {...props} // Spread remaining props here
        >
          <div
            data-sidebar="sidebar"
            className={cn("flex h-full w-full flex-col bg-sidebar text-sidebar-foreground",
             variant === "floating" ? "rounded-lg border border-sidebar-border shadow" : "",
             state === 'collapsed' && currentCollapsible === 'offcanvas' ? "hidden" : "" // Hide content div if offcanvas collapsed
             )}
          >
            {children}
          </div>
        </div>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"


const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", className)} // Standard icon button size
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeft className="h-5 w-5" /> {/* Consistent Icon */}
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"


const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
        "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      {...props}
    />
  )
})
SidebarRail.displayName = "SidebarRail"

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background",
        "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        className
      )}
      {...props}
    />
  )
})
SidebarInput.displayName = "SidebarInput"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn(
          "flex items-center justify-center gap-2 p-2 h-14 border-b border-sidebar-border",
          className
      )}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("flex flex-col gap-1 p-2 border-t border-sidebar-border", className)} // Add border-t
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn("mx-2 w-auto bg-sidebar-border", className)}
      {...props}
    />
  )
})
SidebarSeparator.displayName = "SidebarSeparator"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden group-data-[collapsible=icon]:overflow-visible", // Allow overflow visible for tooltips
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  )
})
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opacity] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupAction.displayName = "SidebarGroupAction"

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-content"
    className={cn("w-full text-sm", className)}
    {...props}
  />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("flex w-full min-w-0 flex-col gap-1 list-none", className)} // Added list-none
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("group/menu-item relative", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
   "peer/menu-button flex items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-5 [&>svg]:shrink-0", // Icon size 5
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
        ghost: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", // Added ghost variant
      },
      size: {
         default: "h-10 w-full justify-start", // Full width, standard height
         icon: "h-10 w-10 justify-center", // Square for icon-only
         sm: "h-9 text-xs", // Kept sm and lg if needed elsewhere
         lg: "h-11 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)


const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size: sizeProp, // Rename to avoid conflict
      tooltip,
      className,
      children, // Destructure children
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const { isMobile, state } = useSidebar()
    const isCollapsed = state === 'collapsed';

    // Determine size based on collapsed state if not explicitly provided
    const size = sizeProp ?? (isCollapsed && !isMobile ? 'icon' : 'default');


    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </Comp>
    )

    if (!tooltip || isMobile || state === 'expanded') {
        return button; // Don't show tooltip if expanded or on mobile
    }


    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip,
      }
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          // hidden={state !== "collapsed" || isMobile} // Handled by outer condition
          {...tooltip}
        />
      </Tooltip>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    showOnHover?: boolean
  }
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden", // Hide action when collapsed
        showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuAction.displayName = "SidebarMenuAction"

const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="menu-badge"
    className={cn(
      "absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground select-none pointer-events-none",
      "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
      "peer-data-[size=sm]/menu-button:top-1",
      "peer-data-[size=default]/menu-button:top-1.5",
      "peer-data-[size=lg]/menu-button:top-2.5",
      "group-data-[collapsible=icon]:hidden", // Hide badge when collapsed
      className
    )}
    {...props}
  />
))
SidebarMenuBadge.displayName = "SidebarMenuBadge"

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    showIcon?: boolean
  }
>(({ className, showIcon = false, ...props }, ref) => {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn(
          "rounded-md h-10 flex gap-2 items-center", // Use h-10 for consistency
          isCollapsed ? "w-10 justify-center px-0" : "px-2", // Adjust padding/width when collapsed
          className
      )}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-5 rounded-md flex-shrink-0" // Icon size 5
          data-sidebar="menu-skeleton-icon"
        />
      )}
      {!isCollapsed && ( // Only show text skeleton if not collapsed
        <Skeleton
          className="h-4 flex-1 max-w-[--skeleton-width]"
          data-sidebar="menu-skeleton-text"
          style={
            {
              "--skeleton-width": width,
            } as React.CSSProperties
          }
        />
      )}
    </div>
  )
})
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton"


const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={cn(
      "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
      "group-data-[collapsible=icon]:hidden", // Hide sub-menu when collapsed
      className
    )}
    {...props}
  />
))
SidebarMenuSub.displayName = "SidebarMenuSub"

const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ ...props }, ref) => <li ref={ref} {...props} />)
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean
    size?: "sm" | "md"
    isActive?: boolean
  }
>(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden", // Hide sub-button when collapsed
        className
      )}
      {...props}
    />
  )
})
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
  NotificationsContent, // Export NotificationsContent
  colorThemes, // Export colorThemes
}
