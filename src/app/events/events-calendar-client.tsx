'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { MapPin } from 'lucide-react';
import type { Event } from '@prisma/client'; // Import the Event type from Prisma

interface EventsCalendarClientProps {
    allEvents: Event[];
    upcomingEvents: Event[]; // Pass upcoming events too if needed, or filter client-side
}

// Helper function to format date ranges
const formatDateRange = (start: Date, end?: Date | null): string => {
    if (end && format(start, 'yyyy-MM-dd') !== format(end, 'yyyy-MM-dd')) {
        return `${format(start, 'PPP')} - ${format(end, 'PPP')}`;
    }
    return format(start, 'PPP');
};

export default function EventsCalendarClient({ allEvents }: EventsCalendarClientProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    const eventsOnSelectedDate = selectedDate
        ? allEvents.filter(event => {
            if (!event.Date) return false; // Skip events without a start date

            const eventStart = new Date(event.Date);
            eventStart.setHours(0, 0, 0, 0); // Normalize start date
            const selected = new Date(selectedDate);
            selected.setHours(0, 0, 0, 0); // Normalize selected date

            if (event.EndDate) {
                const eventEnd = new Date(event.EndDate);
                eventEnd.setHours(23, 59, 59, 999); // Normalize end date to end of day
                return selected >= eventStart && selected <= eventEnd;
            } else {
                // For single-day events
                 return format(eventStart, 'yyyy-MM-dd') === format(selected, 'yyyy-MM-dd');
            }
        })
        : [];

    // Generate dates for highlighting multi-day events
    const eventDates = allEvents.flatMap(event => {
        if (!event.Date) return [];
        const dates = [];
        let currentDate = new Date(event.Date);
        currentDate.setHours(0, 0, 0, 0); // Normalize start date
        const endDate = event.EndDate ? new Date(event.EndDate) : new Date(event.Date);
        endDate.setHours(23, 59, 59, 999); // Normalize end date

        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 flex justify-center animate-slideInFromLeft">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border shadow-md w-full" // Make calendar take full width of its column
                    modifiers={{ booked: eventDates }}
                    modifiersClassNames={{
                        booked: 'bg-accent/20 text-accent-foreground rounded-full',
                    }}
                    initialFocus
                />
            </div>

            <div className="md:col-span-2 space-y-6 animate-slideInFromRight">
                <h2 className="text-2xl font-semibold">
                    Events on {selectedDate ? format(selectedDate, 'PPP') : 'selected date'}
                </h2>
                {eventsOnSelectedDate.length > 0 ? (
                    eventsOnSelectedDate.map(event => (
                        <Card key={`${event.EventID}-selected`} className="hover:shadow-lg transition-shadow duration-300 animate-fadeIn">
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center gap-2">{event.Title}</CardTitle>
                                <CardDescription className="text-sm text-muted-foreground">
                                    {event.Date ? formatDateRange(event.Date, event.EndDate) : 'Date TBD'}
                                </CardDescription>
                                <CardDescription className="flex items-center gap-1 text-sm">
                                    <MapPin className="h-4 w-4 text-muted-foreground" /> {event.Location || 'Location TBD'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-foreground/80">{event.Description || 'No description available.'}</p>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="animate-fadeIn">
                        <CardContent className="pt-6">
                            <p className="text-muted-foreground">No events scheduled for this date.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
