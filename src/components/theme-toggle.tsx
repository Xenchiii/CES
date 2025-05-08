
'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className, ...props }: React.ComponentProps<typeof Button>) {
  const { setTheme, theme } = useTheme();
  const { state: sidebarState, isMobile } = useSidebar(); // Add isMobile
  const isCollapsed = sidebarState === 'collapsed';
  const [mounted, setMounted] = React.useState(false);

  // Ensure component is mounted before rendering theme-dependent text
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const buttonContent = (
    <>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
       {/* Always hide text when collapsed on desktop */}
      <span className={cn('ml-2', { 'hidden': isCollapsed && !isMobile })}>
         {/* Only render text after mount to avoid hydration mismatch */}
         {mounted ? (theme === 'light' ? 'Dark Mode' : 'Light Mode') : 'Theme'}
      </span>
      <span className="sr-only">Toggle theme</span>
    </>
  );

   const button = (
     <Button
       variant="ghost"
       size={(isCollapsed && !isMobile) ? "icon" : "default"} // Adjust size
       onClick={toggleTheme}
       className={cn("w-full justify-start", className, { "justify-center": isCollapsed && !isMobile })} // Adjust centering
       aria-label="Toggle theme"
       {...props}
     >
       {buttonContent}
     </Button>
   );

  // Tooltip text logic also needs to wait for mount
  const tooltipText = mounted ? (theme === 'light' ? 'Dark' : 'Light') : 'Theme';

  if (isCollapsed && !isMobile) { // Show tooltip only when collapsed and not mobile
      return (
          <Tooltip>
              <TooltipTrigger asChild>
                  {button}
              </TooltipTrigger>
              <TooltipContent side="right" align="center">
                  Toggle theme ({tooltipText})
              </TooltipContent>
          </Tooltip>
      );
  }


  return button;
}
