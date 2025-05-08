'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Upload, Send } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SubmitProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Add form state using useState or react-hook-form

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Submitting project..."); // Replace with actual form data

    // TODO: Implement project submission logic
    // - Collect form data (title, description, author, tags, urls, image upload)
    // - Validate data
    // - Call API endpoint to save project details (and handle image upload)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert("Project submitted for review! (Demo)"); // Show success message
      router.push('/project-showcase'); // Redirect back to showcase
    } catch (error) {
      console.error("Error submitting project:", error);
      alert("Failed to submit project. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl space-y-8">
      <Link href="/project-showcase" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors link-underline-grow animate-fadeIn">
        <ArrowLeft className="h-4 w-4" />
        Back to Showcase
      </Link>

      <h1 className="text-3xl font-bold text-center animate-fadeIn animation-delay-100">Submit Your Project</h1>
      <p className="text-center text-muted-foreground animate-fadeIn animation-delay-200">Share your work with the CES community!</p>

      <Card className="shadow-lg animate-scaleUp animation-delay-300">
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>Fill out the form below to submit your project.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="proj-title">Project Title</Label>
              <Input id="proj-title" name="title" placeholder="e.g., My Awesome App" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="proj-author">Author(s) / Team Name</Label>
              <Input id="proj-author" name="author" placeholder="e.g., John Doe or Code Warriors" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="proj-description">Description</Label>
              <Textarea id="proj-description" name="description" placeholder="Briefly describe your project..." rows={4} required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="proj-tags">Tags (comma-separated)</Label>
              <Input id="proj-tags" name="tags" placeholder="e.g., React, API, Game Dev" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="proj-github">GitHub URL (Optional)</Label>
                  <Input id="proj-github" name="githubUrl" type="url" placeholder="https://github.com/..." />
                </div>
                 <div className="grid gap-2">
                  <Label htmlFor="proj-live">Live Demo URL (Optional)</Label>
                  <Input id="proj-live" name="liveUrl" type="url" placeholder="https://my-project.com" />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="proj-image">Project Image/Thumbnail</Label>
                <Input id="proj-image" name="image" type="file" accept="image/*" />
                 <p className="text-xs text-muted-foreground">Upload a screenshot or logo for your project. (File upload functionality TBD)</p>
                {/* TODO: Implement actual file upload handling */}
            </div>


            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting} className="btn-hover-scale">
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Submitting...' : 'Submit Project'}
              </Button>
            </div>
             <p className="text-xs text-muted-foreground text-center pt-4">* Project submissions may be subject to review before appearing on the showcase.</p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
