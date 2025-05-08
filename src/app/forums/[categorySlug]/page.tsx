'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { forumCategories, getThreadsForCategory, getCategoryBySlug, getUserById } from '@/lib/mock-data/forums';
import type { ForumThread, ForumUser } from '@/types/forum';
import { MessageSquare, Eye, ArrowLeft, PlusCircle, Lock, Pin } from 'lucide-react'; // Added icons
import { formatDistanceToNow } from 'date-fns';

// Helper function to format date distance
const formatRelativeTime = (date: Date) => {
  return formatDistanceToNow(date, { addSuffix: true });
};


export default function ForumCategoryPage() {
  const params = useParams();
  const categorySlug = params.categorySlug as string;

  const category = getCategoryBySlug(categorySlug);
  const threads = category ? getThreadsForCategory(category.id) : [];

  if (!category) {
    return (
        <div className="container mx-auto px-4 py-8 text-center">
            <p className="text-xl text-destructive">Category not found.</p>
             <Link href="/forums" passHref>
                 <Button variant="link" className="mt-4"><ArrowLeft className="mr-2 h-4 w-4"/> Back to Forums</Button>
            </Link>
        </div>
    );
  }

  // Sort threads: sticky first, then by last reply date descending
  const sortedThreads = threads.sort((a, b) => {
      if (a.isSticky && !b.isSticky) return -1;
      if (!a.isSticky && b.isSticky) return 1;
      return b.lastReplyAt.getTime() - a.lastReplyAt.getTime();
  });


  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Link href="/forums" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors link-underline-grow animate-fadeIn">
          <ArrowLeft className="h-4 w-4" />
          Back to Forums
        </Link>
         {/* Add 'New Thread' button - link to a creation page */}
         <Link href={`/forums/${category.slug}/new-thread`} passHref>
             <Button className="btn-hover-scale">
                 <PlusCircle className="mr-2 h-4 w-4" /> New Thread
             </Button>
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-8 animate-fadeIn animation-delay-100">
         <category.icon className="h-10 w-10 text-primary flex-shrink-0" />
         <div>
            <h1 className="text-3xl font-bold">{category.title}</h1>
            <p className="text-muted-foreground">{category.description}</p>
         </div>
      </div>

      {/* Thread List */}
      <div className="space-y-4">
        {sortedThreads.length > 0 ? (
          sortedThreads.map((thread) => {
             const author = getUserById(thread.authorId);
             const lastReplier = null; // TODO: Fetch last replier info if needed

            return (
              <Card key={thread.id} className="hover:shadow-md transition-shadow animate-fadeIn animation-delay-200">
                <CardContent className="p-4 flex items-start gap-4">
                   {author && (
                        <Link href={`/profile/${author.id}`} passHref> {/* Link to user profile if exists */}
                          <Avatar className="h-10 w-10 border">
                            <AvatarImage src={author.avatarUrl} alt={author.name} />
                            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </Link>
                   )}
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                        {thread.isSticky && <Pin className="h-4 w-4 text-accent" title="Sticky" />}
                        {thread.isLocked && <Lock className="h-4 w-4 text-muted-foreground" title="Locked" />}
                        <Link href={`/forums/${category.slug}/${thread.id}`} passHref>
                         <span className="text-lg font-semibold text-primary hover:underline cursor-pointer">
                            {thread.title}
                         </span>
                        </Link>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Started by {author ? author.name : 'Unknown User'} • {formatRelativeTime(thread.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end text-sm text-muted-foreground text-right space-y-1 w-28 flex-shrink-0">
                     <div className="flex items-center gap-1" title="Replies">
                       <MessageSquare className="h-4 w-4" />
                       <span>{thread.replyCount}</span>
                     </div>
                      <div className="flex items-center gap-1" title="Views">
                         <Eye className="h-4 w-4" />
                         <span>{thread.viewCount}</span>
                      </div>
                     <div title={`Last reply ${formatRelativeTime(thread.lastReplyAt)}`}>
                         {/* Optionally show last replier avatar/name */}
                         <span className="text-xs">{formatRelativeTime(thread.lastReplyAt)}</span>
                     </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="animate-fadeIn animation-delay-200">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No threads found in this category yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Removed generateStaticParams because this is a Client Component ('use client')
// export async function generateStaticParams() {
//   return forumCategories.map((category) => ({
//     categorySlug: category.slug,
//   }));
// }
