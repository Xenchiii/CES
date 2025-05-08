
import type { Metadata } from 'next';

// This layout can be used to wrap all dynamic subject pages
// if common elements or structure are needed beyond the main app layout.
// For now, it's a simple pass-through.

export default function SubjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

// Note: Metadata for dynamic routes should be generated in the page.tsx itself
// using generateMetadata function for better SEO and per-page customization.
