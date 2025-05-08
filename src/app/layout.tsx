'use client'; // Need client component for useEffect and Sparrow

import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Using Inter as a default clean font
import './globals.css';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/app-sidebar';
import { Toaster } from '@/components/ui/toaster'; // Import Toaster
import AppHeader from '@/components/app-header';
import { ThemeProvider } from '@/components/theme-provider'; // Import ThemeProvider
import SparrowCompanion from '@/components/sparrow-companion'; // Import SparrowCompanion
import { useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

// Remove metadata export as this is now a client component
// export const metadata: Metadata = {
//   title: 'ICCT COLLEGES COMPUTER EXPLORER SOCIETY - ANTIPOLO CAMPUS',
//   description: 'Official website for the ICCT CES - Antipolo Campus',
// };

// Define available color themes (must match globals.css) - Moved to sidebar.tsx for direct use
// const colorThemes = [ ... ];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    // Effect to apply saved color theme class on mount
     useEffect(() => {
        const savedTheme = localStorage.getItem('colorTheme') || 'theme-default';
        // Dynamically import colorThemes here if needed, or ensure it's available
        // For simplicity, assuming globals.css handles the classes directly
        // If dynamic application is essential, fetch themes or keep them here.
        // Example:
        // const applyTheme = async () => {
        //   const { colorThemes } = await import('@/components/ui/sidebar'); // Or from a dedicated config
        //   colorThemes.forEach(t => document.documentElement.classList.remove(t.className));
        //   document.documentElement.classList.add(savedTheme);
        // }
        // applyTheme();

        // Simplified: Directly add the class name from storage
        // Requires theme class names to be consistent and available in globals.css
         const allThemeClasses = [ // List all possible theme classes used in globals.css
             'theme-default', 'theme-ocean', 'theme-sunset', 'theme-forest', 'theme-desert',
             'theme-mountain', 'theme-autumn', 'theme-winter', 'theme-tropical', 'theme-lavender',
             'theme-urban', 'theme-meadow', 'theme-galaxy', 'theme-rainforest', 'theme-vintage',
             'theme-icecream', 'theme-candlelit', 'theme-seaside', 'theme-wildflower', 'theme-crimson'
         ];
         allThemeClasses.forEach(cls => document.documentElement.classList.remove(cls));
         document.documentElement.classList.add(savedTheme);

     }, []);

  return (
    // Add suppressHydrationWarning to html tag
    <html lang="en" suppressHydrationWarning>
        {/* Add head section for metadata since it cannot be exported */}
        <head>
            <title>ICCT COLLEGES COMPUTER EXPLORER SOCIETY - ANTIPOLO CAMPUS</title>
            <meta name="description" content="Official website for the ICCT CES - Antipolo Campus" />
            {/* Add other necessary meta tags, links etc. here */}
        </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class" // Handles light/dark mode class on <html>
          defaultTheme="system"
          enableSystem
          // disableTransitionOnChange // Removed to enable smooth transitions
        >
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <div className="flex flex-1 flex-col">
                <AppHeader />
                <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
              </div>
            </div>
          </SidebarProvider>
          <Toaster /> {/* Add Toaster component here */}
          <SparrowCompanion /> {/* Add Sparrow component here */}
        </ThemeProvider>
      </body>
    </html>
  );
}

