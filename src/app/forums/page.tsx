import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MessageSquare, List, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { forumCategories } from '@/lib/mock-data/forums'; // Import mock data

export default function ForumsPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <h1 className="text-4xl font-bold text-center mb-8 flex items-center justify-center gap-3 animate-fadeIn">
        <MessageSquare className="text-accent h-9 w-9" /> Forums
      </h1>
      <p className="text-center text-lg text-muted-foreground mb-12 max-w-3xl mx-auto animate-fadeIn animation-delay-100">
         Join discussions, ask questions, share resources, and collaborate with fellow CES members. Select a category to get started.
       </p>

       {/* Category List */}
       <Card className="shadow-xl animate-scaleUp animation-delay-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><List className="h-6 w-6 text-primary"/> Forum Categories</CardTitle>
              <CardDescription>Browse different discussion areas.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {forumCategories.map((category) => (
                <Link key={category.id} href={`/forums/${category.slug}`} passHref>
                  <Card className="bg-card/70 hover:shadow-md hover:bg-accent/10 transition-all duration-200 h-full flex flex-col">
                      <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                         <category.icon className="h-6 w-6 text-primary flex-shrink-0" />
                         <CardTitle className="text-base font-semibold">{category.title}</CardTitle>
                     </CardHeader>
                     <CardContent className="flex-grow">
                         <p className="text-sm text-muted-foreground">{category.description}</p>
                     </CardContent>
                     <CardContent className="pt-0 text-right">
                         <ArrowRight className="h-4 w-4 text-muted-foreground inline-block ml-auto" />
                     </CardContent>
                  </Card>
                </Link>
              ))}
            </CardContent>
       </Card>

    </div>
  );
}
