import prisma from '@/lib/prisma'; // Use aliased path
// import { Prisma } from '@prisma/client'; // Import Prisma namespace
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, MapPin } from 'lucide-react';
import EventsCalendarClient from './events-calendar-client'; // Import the client component
import { format } from 'date-fns';
import type { Event } from '@prisma/client'; // Keep type import
import { Prisma } from '@prisma/client'; // Re-add Prisma namespace import

// Helper function to format date ranges (can remain here or move to utils)
const formatDateRange = (start: Date | null, end?: Date | null): string => {
    if (!start) return 'Date TBD';
    if (end && format(start, 'yyyy-MM-dd') !== format(end, 'yyyy-MM-dd')) {
        return `${format(start, 'PPP')} - ${format(end, 'PPP')}`;
    }
    return format(start, 'PPP');
}

export default async function EventsPage() {
    let eventsData: Event[] = [];
    let upcomingEvents: Event[] = [];

    try {
        // START: TEMPORARILY COMMENTED OUT PRISMA CALLS DUE TO libssl ERROR
        // eventsData = await prisma.event.findMany({
        //     orderBy: {
        //         Date: 'asc', // Sort by start date
        //     },
        // });
         console.warn("Prisma calls temporarily disabled in Events page due to environment issue (missing libssl).");
        eventsData = []; // Use empty array as fallback
        upcomingEvents = []; // Use empty array as fallback

        // // Filter for upcoming events (server-side) - Keep commented if eventsData is empty
        // const now = new Date();
        // now.setHours(0, 0, 0, 0); // Start of today
        // upcomingEvents = eventsData.filter(event => {
        //     const eventEnd = event.EndDate || event.Date;
        //     return eventEnd && eventEnd >= now;
        // });
        // END: TEMPORARILY COMMENTED OUT PRISMA CALLS
    } catch(error) {
        console.error("Failed to fetch events data (or using fallback):", error);
        // Keep eventsData and upcomingEvents as empty arrays
        eventsData = [];
        upcomingEvents = [];
        // In a real app, you might want to show an error message to the user
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <h1 className="text-4xl font-bold text-center mb-8 flex items-center justify-center gap-3 animate-fadeIn">
                <CalendarDays className="text-accent h-8 w-8" /> Event Calendar
            </h1>

            {/* Pass all events data to the client component */}
            <EventsCalendarClient allEvents={eventsData} upcomingEvents={upcomingEvents} />

            {/* Display All Upcoming Events (Server Rendered List) */}
            <hr className="my-8"/>
            <h2 className="text-2xl font-semibold mt-8">All Upcoming Events</h2>
            {upcomingEvents.length > 0 ? (
                upcomingEvents.map(event => (
                    <Card key={`${event.EventID}-all`} className="mb-4 hover:shadow-lg transition-shadow duration-300 animate-fadeIn">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">{event.Title}</CardTitle>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                                <CardDescription className="text-sm text-muted-foreground">
                                    {formatDateRange(event.Date, event.EndDate)}
                                </CardDescription>
                                <CardDescription className="flex items-center gap-1 text-sm mt-1 sm:mt-0">
                                    <MapPin className="h-4 w-4 text-muted-foreground" /> {event.Location || 'Location TBD'}
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-foreground/80">{event.Description || 'No description available.'}</p>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Card className="animate-fadeIn">
                    <CardContent className="pt-6">
                        <p className="text-muted-foreground">No upcoming events found.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
