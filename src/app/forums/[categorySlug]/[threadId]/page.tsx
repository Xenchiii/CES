'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getCategoryBySlug, getThreadById, getPostsForThread, getUserById } from '@/lib/mock-data/forums';
import type { ForumPost, ForumUser } from '@/types/forum';
import { ArrowLeft, MessageSquare, ThumbsUp, Award, Edit, Trash2, Flag, Lock } from 'lucide-react'; // Added icons
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge'; // Import Badge component

// Helper function to format date distance
const formatRelativeTime = (date: Date) => {
  return formatDistanceToNow(date, { addSuffix: true });
};

export default function ForumThreadPage() {
  const params = useParams();
  const categorySlug = params.categorySlug as string;
  const threadId = params.threadId as string;
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const category = getCategoryBySlug(categorySlug);
  const thread = getThreadById(threadId);
  const posts = thread ? getPostsForThread(thread.id) : [];

  if (!category || !thread) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-xl text-destructive">Thread not found.</p>
        <Link href={category ? `/forums/${category.slug}` : '/forums'} passHref>
          <Button variant="link" className="mt-4"><ArrowLeft className="mr-2 h-4 w-4"/> Back to {category ? category.title : 'Forums'}</Button>
        </Link>
      </div>
    );
  }

  const handleReplySubmit = () => {
      if (!replyContent.trim()) return;
      console.log("Submitting reply:", replyContent);
      // TODO: Implement actual post creation logic here
      // - Call an API endpoint
      // - Add the new post to the `forumPosts` mock data (for demo)
      // - Reset replyContent and isReplying
      // - Potentially re-fetch posts or update state locally

       const newPost: ForumPost = {
          id: `post${Date.now()}`,
          threadId: thread.id,
          authorId: 'user1', // Simulate logged-in user
          content: `<p>${replyContent.replace(/\n/g, '<br/>')}</p>`, // Basic formatting
          createdAt: new Date(),
          upvotes: 0,
          isBestAnswer: false,
       };
       // NOTE: In a real app, you'd update state via API response or state management
       posts.push(newPost); // Directly modify mock data for demo

      setReplyContent('');
      setIsReplying(false);
      // Force re-render if necessary, or rely on state update if using proper state management
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Link href={`/forums/${category.slug}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors link-underline-grow animate-fadeIn">
          <ArrowLeft className="h-4 w-4" />
          Back to {category.title}
        </Link>
        {/* Add Subscribe/Unsubscribe button if needed */}
      </div>

      <h1 className="text-3xl font-bold mb-4 animate-fadeIn animation-delay-100">{thread.title}</h1>

      {/* Post List */}
      <ScrollArea className="h-[calc(100vh-300px)] pr-4"> {/* Adjust height as needed */}
        <div className="space-y-6">
          {posts.map((post, index) => {
            const author = getUserById(post.authorId);
            return (
              <Card key={post.id} id={`post-${post.id}`} className={`animate-fadeIn ${post.isBestAnswer ? 'border-green-500 bg-green-500/5' : ''}`} style={{ animationDelay: `${index * 0.05}s` }}>
                <CardContent className="p-4 flex items-start gap-4">
                  {/* Author Info */}
                  <div className="flex flex-col items-center w-24 flex-shrink-0">
                    {author && (
                         <Link href={`/profile/${author.id}`} passHref>
                            <Avatar className="h-12 w-12 border mb-2">
                              <AvatarImage src={author.avatarUrl} alt={author.name} />
                              <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                         </Link>
                    )}
                    <span className="text-sm font-medium text-center">{author ? author.name : 'Unknown'}</span>
                    <span className="text-xs text-muted-foreground text-center">{author?.role || 'Member'}</span>
                  </div>

                  {/* Post Content & Actions */}
                  <div className="flex-grow space-y-3">
                    <div className="text-xs text-muted-foreground flex justify-between items-center">
                        <span>Posted {formatRelativeTime(post.createdAt)}</span>
                        {/* Post Actions (Edit, Delete, Report) - Add logic/permissions later */}
                        <div className="flex items-center gap-2">
                             {post.isBestAnswer && (
                                <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                                    <Award className="mr-1 h-3 w-3"/> Best Answer
                                </Badge>
                             )}
                             {/* Example Actions - Implement functionality later */}
                             {/* <Button variant="ghost" size="icon" className="h-6 w-6"><Edit className="h-4 w-4"/></Button>
                             <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive"><Trash2 className="h-4 w-4"/></Button>
                             <Button variant="ghost" size="icon" className="h-6 w-6"><Flag className="h-4 w-4"/></Button> */}
                        </div>
                    </div>
                     {/* Render HTML content safely */}
                    <div
                        className="prose prose-sm dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Voting & Reply Actions */}
                    <div className="flex items-center gap-4 pt-2">
                         <Button variant="outline" size="sm" className="text-muted-foreground">
                            <ThumbsUp className="mr-1 h-4 w-4" /> {post.upvotes}
                         </Button>
                          {/* Add Mark as Best Answer Button (for admins/OP) */}
                         {/* {!post.isBestAnswer && author?.role === 'admin' && (
                             <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white">
                                <Award className="mr-1 h-4 w-4" /> Mark as Best
                             </Button>
                         )} */}
                         <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setIsReplying(true)}>
                             Reply
                         </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>

        {/* Reply Box */}
        {!thread.isLocked && (
             <Card className="mt-6 animate-fadeIn animation-delay-500">
                 <CardHeader>
                     <CardTitle>Post a Reply</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                     {/* TODO: Replace with a proper Rich Text Editor */}
                     <Textarea
                         placeholder="Type your reply here..."
                         value={replyContent}
                         onChange={(e) => setReplyContent(e.target.value)}
                         rows={5}
                         className="bg-background" // Ensure contrast
                     />
                      <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setReplyContent('')}>Cancel</Button>
                          <Button onClick={handleReplySubmit} disabled={!replyContent.trim()}>
                              <MessageSquare className="mr-2 h-4 w-4" /> Submit Reply
                          </Button>
                      </div>
                 </CardContent>
             </Card>
        )}
        {thread.isLocked && (
             <Card className="mt-6 border-dashed border-muted-foreground">
                <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground flex items-center justify-center gap-2"><Lock className="h-4 w-4"/> This thread is locked. No new replies can be added.</p>
                </CardContent>
             </Card>
        )}
    </div>
  );
}
