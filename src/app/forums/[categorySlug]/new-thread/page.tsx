'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { getCategoryBySlug, forumThreads } from '@/lib/mock-data/forums'; // Import threads for mock creation
import type { ForumThread } from '@/types/forum';
import { ArrowLeft, Send, FileText, Image as ImageIcon } from 'lucide-react'; // Added icons
import { useState } from 'react';

export default function NewThreadPage() {
  const params = useParams();
  const router = useRouter();
  const categorySlug = params.categorySlug as string;
  const category = getCategoryBySlug(categorySlug);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Add state for file attachments if implementing uploads

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
        // Basic validation
        alert("Title and content cannot be empty.");
        return;
    }
    setIsSubmitting(true);
    console.log("Submitting new thread:", { title, content });

    // TODO: Implement actual thread creation logic here
    // - Call an API endpoint
    // - Add the new thread and initial post to mock data (for demo)
    // - Redirect to the newly created thread page

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock creation
        const newThreadId = `thread${Date.now()}`;
        const newThread: ForumThread = {
            id: newThreadId,
            categoryId: category.id,
            title: title,
            authorId: 'user1', // Simulate logged-in user
            createdAt: new Date(),
            lastReplyAt: new Date(),
            replyCount: 0, // Initial post doesn't count as reply here
            viewCount: 0,
        };
         // Add initial post
         const initialPost = {
            id: `post${Date.now()}`,
            threadId: newThreadId,
            authorId: 'user1',
            content: `<p>${content.replace(/\n/g, '<br/>')}</p>`, // Basic formatting
            createdAt: new Date(),
            upvotes: 0,
         };

        // NOTE: In a real app, update state via API response
        // forumThreads.push(newThread); // Add to mock data
        // forumPosts.push(initialPost);

        console.log("Mock thread created:", newThread);
        console.log("Mock initial post created:", initialPost);


        // Redirect to the new thread
        router.push(`/forums/${category.slug}/${newThreadId}`);

    } catch (error) {
        console.error("Error creating thread:", error);
        alert("Failed to create thread. Please try again.");
        setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 max-w-3xl">
      <Link href={`/forums/${category.slug}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors link-underline-grow animate-fadeIn">
        <ArrowLeft className="h-4 w-4" />
        Back to {category.title}
      </Link>

      <h1 className="text-3xl font-bold animate-fadeIn animation-delay-100">Create New Thread</h1>

      <Card className="shadow-lg animate-scaleUp animation-delay-200">
        <CardHeader>
          <CardTitle>New Thread in "{category.title}"</CardTitle>
          <CardDescription>Share your thoughts or ask a question.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="thread-title">Title</Label>
              <Input
                id="thread-title"
                placeholder="Enter a descriptive title for your thread"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={150} // Example limit
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thread-content">Content</Label>
               {/* TODO: Replace with Rich Text Editor */}
              <Textarea
                id="thread-content"
                placeholder="Write the main content of your post here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={10}
                className="bg-background"
              />
               <div className="text-xs text-muted-foreground">
                   Basic formatting is supported. Use line breaks for paragraphs.
               </div>
            </div>

             {/* TODO: Add File Upload Component */}
             {/* <div className="space-y-2">
                 <Label htmlFor="thread-attachments">Attachments (Optional)</Label>
                 <Input id="thread-attachments" type="file" multiple />
                 <div className="flex gap-2 mt-1">
                     <Button type="button" variant="outline" size="sm"><ImageIcon className="mr-1 h-4 w-4"/> Add Image</Button>
                     <Button type="button" variant="outline" size="sm"><FileText className="mr-1 h-4 w-4"/> Add File</Button>
                 </div>
             </div> */}

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting} className="btn-hover-scale">
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Posting...' : 'Post Thread'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
