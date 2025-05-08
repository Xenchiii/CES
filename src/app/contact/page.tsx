'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Mail, User, MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  async function onSubmit(data: ContactFormValues) {
     setIsSubmitting(true);
    console.log("Contact form submitted:", data); // Log data

    // Simulate sending the message (replace with actual API call)
    try {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
        // Assume success
        toast({
          title: "Message Sent!",
          description: "Thank you for contacting us. We'll get back to you soon.",
        });
        form.reset(); // Reset form on success
    } catch (error) {
        console.error("Failed to send message:", error);
         toast({
           variant: "destructive",
           title: "Error Sending Message",
           description: "Something went wrong. Please try again later.",
         });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-4xl font-bold text-center mb-10 flex items-center justify-center gap-3 animate-fadeIn">
        <Mail className="text-accent h-9 w-9" /> Contact Us
      </h1>
      <p className="text-center text-lg text-muted-foreground mb-12 animate-fadeIn animation-delay-100">
        Have questions, suggestions, or interested in joining? Send us a message!
      </p>

      <Card className="shadow-xl animate-scaleUp animation-delay-200">
        <CardHeader>
          <CardTitle>Send a Message</CardTitle>
          <CardDescription>Fill out the form below and we'll respond as soon as possible.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5"><User className="h-4 w-4"/> Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5"><Mail className="h-4 w-4"/> Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Inquiry about membership" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5"><MessageSquare className="h-4 w-4"/> Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Type your message here..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-right">
                <Button type="submit" disabled={isSubmitting} className="btn-hover-scale btn-hover-shadow">
                  <Send className="mr-2 h-4 w-4" /> {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

       {/* Add contact details */}
       <Card className="mt-10 shadow-lg animate-fadeIn animation-delay-300">
         <CardHeader>
           <CardTitle>Other Ways to Reach Us</CardTitle>
         </CardHeader>
         <CardContent className="space-y-3 text-muted-foreground">
           <p><strong>Location:</strong> J. Sumulong Street, Antipolo, 1870 Rizal</p>
           <p><strong>Email:</strong> <a href="mailto:computerexplorer.antipolo@gmail.com" className="text-primary hover:underline">computerexplorer.antipolo@gmail.com</a></p>
           <p><strong>Facebook:</strong> <a href="https://www.facebook.com/ices.antipolochapter" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://www.facebook.com/ices.antipolochapter</a></p>
         </CardContent>
       </Card>
    </div>
  );
}

// Add animation delay utility if needed
// <style jsx>{` .animation-delay-100 { animation-delay: 0.1s; } .animation-delay-200 { animation-delay: 0.2s; } .animation-delay-300 { animation-delay: 0.3s; } `}</style>
