
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export function BackButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  const router = useRouter();
  const { state: sidebarState, isMobile } = useSidebar(); // Add isMobile check
  const isCollapsed = sidebarState === 'collapsed';

  const buttonContent = (
    <>
      <ArrowLeft className="h-[1.2rem] w-[1.2rem]" />
       {/* Always hide text when collapsed on desktop */}
       <span className={cn('ml-2', { 'hidden': isCollapsed && !isMobile })}>
         Back
       </span>
      <span className="sr-only">Go back</span>
    </>
  );

   const button = (
     <Button
       variant="ghost"
       size={(isCollapsed && !isMobile) ? "icon" : "default"} // Adjust size based on collapsed state and not mobile
       onClick={() => router.back()}
       className={cn("w-full justify-start", className, { "justify-center": isCollapsed && !isMobile })} // Center only when collapsed and not mobile
       aria-label="Go back"
       {...props}
     >
        {buttonContent}
     </Button>
   );

    if (isCollapsed && !isMobile) { // Show tooltip only when collapsed and not on mobile
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    {button}
                </TooltipTrigger>
                <TooltipContent side="right" align="center">
                   Go back
                </TooltipContent>
            </Tooltip>
        );
    }

  return button;
}
