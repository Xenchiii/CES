'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2, Sparkles, Loader2, Users, DollarSign } from "lucide-react"; // Added Users, DollarSign
import { useState, useEffect } from 'react'; // Added useEffect
import { format } from 'date-fns';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateContent, GenerateContentInput } from "@/ai/flows/content-generation-flow"; // Import AI flow
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox
import type { Event as PrismaEvent } from '@prisma/client'; // Import Prisma type
import { Prisma } from '@prisma/client'; // Import Prisma namespace

// Mock data structure matching Prisma schema (dates as Date objects)
const mockEventsData: PrismaEvent[] = [
  { EventID: 1, Title: 'Preliminary Exam', Date: new Date(2025, 4, 4), EndDate: new Date(2025, 4, 7), Location: 'ICCT Colleges Antipolo Campus', Description: 'College preliminary examinations.', RequiresRegistration: false, RegistrationFee: new Prisma.Decimal(0), RegistrationCount: 0 },
  { EventID: 2, Title: 'Midterm Exam', Date: new Date(2025, 5, 5), EndDate: new Date(2025, 5, 8), Location: 'ICCT Colleges Antipolo Campus', Description: 'College midterm examinations.', RequiresRegistration: false, RegistrationFee: new Prisma.Decimal(0), RegistrationCount: 0 },
  { EventID: 3, Title: 'CCS Day', Date: new Date(2025, 5, 13), EndDate: new Date(2025, 5, 14), Location: 'ICCT Cainta Campus', Description: 'Annual celebration for the College of Computer Studies.', RequiresRegistration: true, RegistrationFee: new Prisma.Decimal(50), RegistrationCount: 55 }, // Example with registration
  { EventID: 4, Title: 'Sports Festival 2025', Date: new Date(2025, 5, 20), EndDate: null, Location: 'Marikina Sports Center', Description: 'Annual sports festival.', RequiresRegistration: false, RegistrationFee: new Prisma.Decimal(0), RegistrationCount: 0 },
  { EventID: 5, Title: 'Finals Exam', Date: new Date(2025, 5, 26), EndDate: new Date(2025, 5, 29), Location: 'ICCT Colleges Antipolo Campus', Description: 'College final examinations.', RequiresRegistration: false, RegistrationFee: new Prisma.Decimal(0), RegistrationCount: 0 },
  { EventID: 6, Title: 'Arduino Seminar', Date: new Date(2025, 5, 6), EndDate: null, Location: 'ICCT Colleges Antipolo - Room 301', Description: 'Seminar on Arduino programming led by Sir Jerico Vilog.', RequiresRegistration: true, RegistrationFee: new Prisma.Decimal(0), RegistrationCount: 30 }, // Added Arduino seminar
];

// Type for the state, allowing Date or string temporarily for input binding
type EditableEvent = Omit<PrismaEvent, 'Date' | 'EndDate' | 'RegistrationFee'> & {
    Date?: Date | string | null;
    EndDate?: Date | string | null;
    RegistrationFee?: number | string | Prisma.Decimal | null; // Allow number/string for input
};

export default function AdminEventsManagement() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [events, setEvents] = useState<PrismaEvent[]>(mockEventsData); // Use mock data initially
    const [isEditing, setIsEditing] = useState(false);
    const [currentEvent, setCurrentEvent] = useState<Partial<EditableEvent> | null>(null);
    const [isAiGenerating, setIsAiGenerating] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [aiKeyPoints, setAiKeyPoints] = useState('');

     // Fetch events data from API/DB on component mount (example structure)
     // useEffect(() => {
     //     async function fetchEvents() {
     //         // Replace with your actual API call
     //         // const response = await fetch('/api/events');
     //         // const data = await response.json();
     //         // setEvents(data.map(event => ({ // Ensure dates are Date objects
     //         //     ...event,
     //         //     Date: event.Date ? new Date(event.Date) : null,
     //         //     EndDate: event.EndDate ? new Date(event.EndDate) : null,
     //         // })));
     //     }
     //     fetchEvents();
     // }, []);


     const formatDateRange = (start: Date | null | undefined, end?: Date | null | undefined): string => {
         if (!start) return 'Date TBD';
         if (end && format(start, 'yyyy-MM-dd') !== format(end, 'yyyy-MM-dd')) {
             return `${format(start, 'PPP')} - ${format(end, 'PPP')}`;
         }
         return format(start, 'PPP');
     }

      // Helper to format date for input type="date"
     const formatDateForInput = (date: Date | string | undefined | null): string => {
        if (!date) return '';
        try {
            const dateObj = typeof date === 'string' ? new Date(`${date}T00:00:00`) : date;
            return format(dateObj, 'yyyy-MM-dd');
        } catch {
          return ''; // Handle invalid date
        }
      };

     const handleAddNew = () => {
         setIsEditing(true);
         setCurrentEvent({ Date: new Date().toISOString().split('T')[0], Title: '', Location: '', Description: '', RequiresRegistration: false, RegistrationCount: 0, RegistrationFee: 0 });
         setAiTopic(''); // Clear AI fields
         setAiKeyPoints('');
     };

     const handleEdit = (event: PrismaEvent) => {
         setIsEditing(true);
         setCurrentEvent({
            ...event,
            Date: event.Date ? formatDateForInput(event.Date) : '', // Format date for input
            EndDate: event.EndDate ? formatDateForInput(event.EndDate) : '',
            RegistrationFee: event.RegistrationFee ? Number(event.RegistrationFee) : 0, // Convert Decimal to number
          });
         setAiTopic(event.Title); // Pre-fill AI topic
         setAiKeyPoints(''); // Clear key points
     };

     const handleDelete = async (id: number) => {
         // TODO: Add confirmation dialog
         // For demo: Remove from local state
         setEvents(events.filter(e => e.EventID !== id));

         // TODO: Call actual delete API
         // try {
         //     const response = await fetch(`/api/events/${id}`, { method: 'DELETE' });
         //     if (!response.ok) throw new Error('Failed to delete event');
         //     // Optionally refetch or rely on local state update
         // } catch (error) {
         //     console.error("Error deleting event:", error);
         //     // Revert state or show error toast
         // }
     };

     const handleSave = async () => {
         if (!currentEvent) return;

          // Validate and prepare data for saving (convert back to Prisma types)
         const fee = Number(currentEvent.RegistrationFee) || 0;
         const startDate = currentEvent.Date ? new Date(`${currentEvent.Date}T00:00:00`) : null;
         const endDate = currentEvent.EndDate ? new Date(`${currentEvent.EndDate}T00:00:00`) : null;

         const eventDataToSave = {
             ...currentEvent,
             Date: startDate,
             EndDate: endDate,
             RegistrationFee: new Prisma.Decimal(fee < 0 ? 0 : fee),
             RegistrationCount: currentEvent.RegistrationCount || 0,
         };

         // Remove EventID for creation payload
         const { EventID, ...createData } = eventDataToSave;
         const { EventID: updateId, ...updateData } = eventDataToSave;


         // TODO: Call actual create or update API
         if (currentEvent.EventID) {
              // Update existing (Demo: update local state)
              console.log("Updating event (DEMO):", updateData);
              setEvents(events.map(e => e.EventID === currentEvent.EventID ? eventDataToSave as PrismaEvent : e));
             // try {
             //     const response = await fetch(`/api/events/${currentEvent.EventID}`, {
             //         method: 'PUT',
             //         headers: { 'Content-Type': 'application/json' },
             //         body: JSON.stringify(updateData),
             //     });
             //     if (!response.ok) throw new Error('Failed to update event');
             //     const updatedEvent = await response.json();
             //     setEvents(events.map(e => e.EventID === updatedEvent.EventID ? { ...updatedEvent, Date: new Date(updatedEvent.Date), EndDate: updatedEvent.EndDate ? new Date(updatedEvent.EndDate) : null } : e));
             // } catch (error) {
             //     console.error("Error updating event:", error);
             // }
         } else {
              // Add new (Demo: add to local state)
               const newEvent = { ...eventDataToSave, EventID: Date.now() } as PrismaEvent; // Mock ID
               console.log("Adding new event (DEMO):", newEvent);
              setEvents([...events, newEvent]);
             // try {
             //     const response = await fetch('/api/events', {
             //         method: 'POST',
             //         headers: { 'Content-Type': 'application/json' },
             //         body: JSON.stringify(createData),
             //     });
             //     if (!response.ok) throw new Error('Failed to create event');
             //     const createdEvent = await response.json();
             //     setEvents([...events, { ...createdEvent, Date: new Date(createdEvent.Date), EndDate: createdEvent.EndDate ? new Date(createdEvent.EndDate) : null }]);
             // } catch (error) {
             //     console.error("Error creating event:", error);
             // }
         }
         setIsEditing(false);
         setCurrentEvent(null);
     };

      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
         if (!currentEvent) return;
         const { name, value, type } = e.target;
         const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

         // Handle date inputs separately if needed, or rely on string format
         // if (name === 'Date' || name === 'EndDate') {
         //    // Store as string, convert on save
         // }

         setCurrentEvent(prev => ({ ...prev, [name]: newValue }));
      };

       const handleCheckboxChange = (name: keyof EditableEvent, checked: boolean | string) => {
          if (!currentEvent) return;
          setCurrentEvent(prev => ({ ...prev, [name]: checked === true }));
       };

       // Removed handleDateChange, using handleInputChange and formatting on save

       const handleGenerateWithAi = async () => {
        if (!aiTopic.trim()) return;
        setIsAiGenerating(true);
        try {
            const input: GenerateContentInput = {
                contentType: 'event_description',
                topic: aiTopic,
                keyPoints: aiKeyPoints.split('\n').filter(p => p.trim() !== ''),
                tone: 'informative',
                length: 'medium'
            };
            const result = await generateContent(input);
            if (result.generatedContent && !result.generatedContent.startsWith('Content generation failed:')) {
                 setCurrentEvent(prev => ({
                     ...prev,
                     Description: result.generatedContent,
                     Title: prev?.Title || aiTopic,
                 }));
            } else {
                console.error("AI Generation failed:", result.generatedContent);
                alert(`AI Generation failed: ${result.generatedContent}`);
            }
        } catch (error) {
            console.error("Error calling AI generation flow:", error);
            alert(`Error calling AI generation: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsAiGenerating(false);
        }
    };


    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button onClick={handleAddNew}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Event
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="md:col-span-1 flex justify-center">
                     <Calendar
                         mode="single"
                         selected={selectedDate}
                         onSelect={setSelectedDate}
                         className="rounded-md border shadow-sm w-full"
                         // TODO: Add modifiers to highlight event days based on fetched `events`
                     />
                 </div>
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Event Management</CardTitle>
                            <CardDescription>Manage scheduled events and registration (if applicable).</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Date(s)</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Reg.</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {events.map((event) => (
                                        <TableRow key={event.EventID}>
                                            <TableCell className="font-medium">{event.Title}</TableCell>
                                            <TableCell className="text-xs">{formatDateRange(event.Date, event.EndDate)}</TableCell>
                                            <TableCell className="text-xs">{event.Location}</TableCell>
                                             <TableCell className="text-xs">
                                                {event.RequiresRegistration ? `${event.RegistrationCount} / ∞` : 'N/A'}
                                                {Number(event.RegistrationFee) > 0 && ` (₱${Number(event.RegistrationFee).toFixed(2)})`}
                                            </TableCell>
                                            <TableCell className="text-right space-x-1">
                                                 {event.RequiresRegistration && (
                                                     <Button variant="outline" size="icon" className="h-7 w-7" title="Manage Registrations" disabled>
                                                         <Users className="h-4 w-4" />
                                                         <span className="sr-only">Registrations</span>
                                                     </Button>
                                                )}
                                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(event)} title="Edit Event">
                                                    <Edit className="h-4 w-4" />
                                                    <span className="sr-only">Edit</span>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(event.EventID)} title="Delete Event">
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                     {events.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-muted-foreground">
                                                No events found.
                                            </TableCell>
                                        </TableRow>
                                     )}
                                </TableBody>
                            </Table>
                            <p className="text-xs text-muted-foreground mt-4">* Registration management features are placeholders.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

             {/* Add/Edit Event Dialog */}
             <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>{currentEvent?.EventID ? 'Edit Event' : 'Add New Event'}</DialogTitle>
                        <DialogDescription>
                            Enter the details for the event. Use the AI generator for the description if needed.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto pr-2">
                         {currentEvent && (
                             <div className="grid gap-6 py-4">
                                 {/* AI Generation Section */}
                                 <Card className="bg-muted/50">
                                     <CardHeader className="pb-2">
                                         <CardTitle className="text-lg flex items-center gap-2">
                                             <Sparkles className="h-5 w-5 text-primary" /> AI Description Generator
                                         </CardTitle>
                                         <CardDescription>Generate event description based on title and key points.</CardDescription>
                                     </CardHeader>
                                     <CardContent className="space-y-3">
                                         <div className="grid gap-2">
                                             <Label htmlFor="ai-topic-event">Event Title / Topic</Label>
                                             <Input
                                                 id="ai-topic-event"
                                                 placeholder="e.g., CCS Day 2025"
                                                 value={aiTopic}
                                                 onChange={(e) => setAiTopic(e.target.value)}
                                                 disabled={isAiGenerating}
                                             />
                                         </div>
                                         <div className="grid gap-2">
                                             <Label htmlFor="ai-key-points-event">Key Points (one per line)</Label>
                                             <Textarea
                                                 id="ai-key-points-event"
                                                 placeholder="e.g., Date: June 13-14\nLocation: ICCT Cainta\nActivities: Coding contest, Tech talks"
                                                 value={aiKeyPoints}
                                                 onChange={(e) => setAiKeyPoints(e.target.value)}
                                                 rows={3}
                                                 disabled={isAiGenerating}
                                             />
                                         </div>
                                         <Button onClick={handleGenerateWithAi} disabled={isAiGenerating || !aiTopic.trim()} size="sm">
                                             {isAiGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                             {isAiGenerating ? 'Generating...' : 'Generate Description'}
                                         </Button>
                                     </CardContent>
                                 </Card>

                                {/* Form Fields */}
                                <div className="grid gap-2">
                                    <Label htmlFor="event-title">Title</Label>
                                    <Input id="event-title" name="Title" value={currentEvent.Title || ''} onChange={handleInputChange} required />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                     <div className="grid gap-2">
                                         <Label htmlFor="event-date">Start Date</Label>
                                         <Input id="event-date" name="Date" type="date" value={formatDateForInput(currentEvent.Date)} onChange={handleInputChange} required />
                                     </div>
                                     <div className="grid gap-2">
                                         <Label htmlFor="event-endDate">End Date (Optional)</Label>
                                         <Input id="event-endDate" name="EndDate" type="date" value={formatDateForInput(currentEvent.EndDate)} onChange={handleInputChange} />
                                     </div>
                                 </div>
                                 <div className="grid gap-2">
                                     <Label htmlFor="event-location">Location</Label>
                                     <Input id="event-location" name="Location" value={currentEvent.Location || ''} onChange={handleInputChange} />
                                 </div>
                                 <div className="grid gap-2">
                                     <Label htmlFor="event-description">Description</Label>
                                     <Textarea id="event-description" name="Description" value={currentEvent.Description || ''} onChange={handleInputChange} rows={5} />
                                 </div>

                                 {/* Event Registration Options */}
                                  <Card className="bg-muted/50">
                                      <CardHeader className="pb-2">
                                          <CardTitle className="text-lg">Registration Settings</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                         <div className="flex items-center space-x-2">
                                              <Checkbox
                                                 id="requiresRegistration"
                                                 name="RequiresRegistration"
                                                 checked={currentEvent.RequiresRegistration}
                                                 onCheckedChange={(checked) => handleCheckboxChange('RequiresRegistration', checked)}
                                              />
                                              <Label htmlFor="requiresRegistration" className="cursor-pointer">
                                                 Requires Registration
                                              </Label>
                                         </div>
                                          {currentEvent.RequiresRegistration && (
                                             <div className="grid sm:grid-cols-2 gap-4 pl-6">
                                                 <div className="grid gap-2">
                                                     <Label htmlFor="registrationFee">Registration Fee (PHP)</Label>
                                                     <div className="flex items-center gap-2">
                                                          <span className="text-muted-foreground">₱</span>
                                                         <Input
                                                             id="registrationFee"
                                                             name="RegistrationFee"
                                                             type="number"
                                                             min="0"
                                                             step="1"
                                                             value={currentEvent.RegistrationFee?.toString() ?? '0'} // Input expects string
                                                             onChange={handleInputChange}
                                                             className="w-24"
                                                         />
                                                     </div>
                                                 </div>
                                                  <div className="grid gap-2">
                                                      <Label htmlFor="registrationCount">Current Registrations</Label>
                                                      <Input id="registrationCount" value={currentEvent.RegistrationCount ?? 0} readOnly disabled className="w-24 bg-muted" />
                                                  </div>
                                             </div>
                                          )}
                                      </CardContent>
                                  </Card>
                             </div>
                        )}
                    </div>
                    <DialogFooter className="pt-4 border-t">
                        <DialogClose asChild>
                           <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="button" onClick={handleSave}>Save Event</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
