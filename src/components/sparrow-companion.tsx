
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Bird, Loader2, CornerDownLeft } from 'lucide-react'; // Added CornerDownLeft
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { sparrowFlow, SparrowInput, SparrowOutput } from '@/ai/flows/sparrow-flow'; // Import SparrowOutput type
import { usePathname, useRouter } from 'next/navigation'; // Import useRouter
import { cn } from '@/lib/utils';

interface DisplayMessage {
  sender: 'user' | 'ai';
  text: string;
  suggestedAction?: SparrowOutput['suggestedAction']; // Add suggested action to display message
}

// TODO: Replace with actual user data from authentication context
const mockUserProfile = {
    name: 'Test User',
    interests: ['AI', 'Web Development'],
    subOrgMembership: 'web-arachnids',
};


export default function SparrowCompanion() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<DisplayMessage[]>([ // Use DisplayMessage type
    { sender: 'ai', text: "Hi there! I'm Sparrow, your guide to the CES Antipolo website. How can I help you today?" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname(); // Get current path
  const router = useRouter(); // Get router for navigation
  // const userProfile = useUserContext(); // Replace with actual user context later

  // Scroll to bottom when messages update
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

   // Function to handle suggested action clicks
   const handleSuggestedAction = (action: SparrowOutput['suggestedAction']) => {
      if (!action) return;

      if (action.url) {
          router.push(action.url); // Navigate using Next.js router
          setIsOpen(false); // Close sheet after navigation
      } else if (action.query) {
          setInput(action.query); // Pre-fill input with suggested query
          // Optionally auto-send: handleSend(action.query); // If you want to auto-send
      }
   };


  const handleSend = async (queryToSend?: string) => {
    const currentQuery = queryToSend || input; // Use provided query or current input
    if (!currentQuery.trim() || isLoading) return;

    console.log(`Sending query: "${currentQuery}"`); // Log sent query

    const userMessage: DisplayMessage = { sender: 'user', text: currentQuery };
    setMessages((prev) => [...prev, userMessage]);
    if (!queryToSend) { // Only clear input if it wasn't a pre-filled query
        setInput('');
    }
    setIsLoading(true);

    try {
      const flowInput: SparrowInput = {
        query: userMessage.text,
        currentPage: pathname, // Include current page context
        userProfile: mockUserProfile, // Pass user profile context
      };
       console.log('Calling sparrowFlow with input:', JSON.stringify(flowInput, null, 2));
      const result = await sparrowFlow(flowInput);
      console.log('Received result from sparrowFlow:', JSON.stringify(result, null, 2)); // Log received result

       // Create AI message including the suggested action
       const aiMessage: DisplayMessage = {
           sender: 'ai',
           text: result.response,
           suggestedAction: result.suggestedAction // Add suggested action here
       };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error calling sparrow flow:', error);
      const errorMessage: DisplayMessage = { sender: 'ai', text: 'Sorry, something went wrong on my end. Please try again.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="default" // Use default theme color
            size="icon"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 btn-hover-scale animate-scaleUp"
            aria-label="Open Sparrow Chat"
          >
             {/* Use Bird icon */}
             <Bird className="h-7 w-7" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md flex flex-col p-0" side="right">
          <SheetHeader className="p-4 border-b flex flex-row items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
                <Bird className="h-6 w-6 text-primary" />
                Sparrow Companion
            </SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-5 w-5" />
                <span className="sr-only">Close Chat</span>
              </Button>
            </SheetClose>
          </SheetHeader>
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className="space-y-2">
                    <div
                      className={cn(
                        'flex items-start gap-3',
                        msg.sender === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {msg.sender === 'ai' && (
                        <Avatar className="h-8 w-8 border border-primary/30">
                           {/* <AvatarImage src="/sparrow-avatar.png" alt="Sparrow" /> */}
                           <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                               <Bird className="h-4 w-4"/>
                           </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          'max-w-[75%] rounded-lg px-3 py-2 text-sm',
                          msg.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        )}
                      >
                        {/* Render potential markdown */}
                         <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
                      </div>
                       {msg.sender === 'user' && (
                         <Avatar className="h-8 w-8 border border-muted-foreground/30">
                           <AvatarFallback className="bg-muted text-muted-foreground text-xs">U</AvatarFallback>
                         </Avatar>
                       )}
                    </div>
                     {/* Display Suggested Action Button if present */}
                    {msg.sender === 'ai' && msg.suggestedAction && (
                         <div className="flex justify-start ml-11"> {/* Align with AI message */}
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-xs h-7 px-2"
                                onClick={() => handleSuggestedAction(msg.suggestedAction)}
                             >
                                 <CornerDownLeft className="mr-1 h-3 w-3"/> {msg.suggestedAction.label}
                             </Button>
                         </div>
                    )}
                 </div>
              ))}
               {isLoading && (
                <div className="flex items-start gap-3 justify-start">
                    <Avatar className="h-8 w-8 border border-primary/30">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                             <Bird className="h-4 w-4"/>
                        </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted text-foreground rounded-lg px-3 py-2 text-sm flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Thinking...
                    </div>
                </div>
               )}
            </div>
          </ScrollArea>
          <SheetFooter className="p-4 border-t">
            <div className="flex gap-2 w-full">
              <Input
                type="text"
                placeholder="Ask Sparrow..."
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="flex-1"
              />
              <Button onClick={() => handleSend()} disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
