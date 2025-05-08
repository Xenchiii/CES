import prisma from '@/lib/prisma'; // Use aliased path
// import { Prisma } from '@prisma/client'; // Import Prisma namespace
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { CalendarDays, Newspaper } from 'lucide-react';
import { format } from 'date-fns'; // Import format
import type { Achievement, Event } from '@prisma/client'; // Keep types for structure
import { Prisma } from '@prisma/client'; // Re-add Prisma namespace import needed for Decimal type

// Helper to format date ranges (consider moving to a utils file)
const formatDateRange = (start: Date | null, end?: Date | null): string => {
    if (!start) return 'Date TBD';
    if (end && format(start, 'yyyy-MM-dd') !== format(end, 'yyyy-MM-dd')) {
        return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    }
    return format(start, 'PPP');
};

// Mock Data (Fallback) - Keep for safety in case Prisma fails
const mockNewsItems: Achievement[] = [
    { AchievementID: 1, Title: 'Preliminary Exam Approaching', Date: new Date('2025-05-04'), Org: null, Description: 'Prepare for the upcoming Preliminary Examinations starting May 4th until May 7th, 2025.', Participants: null, Image: 'https://picsum.photos/seed/exam1/400/200', DataAiHint: 'exam test study' },
    { AchievementID: 2, Title: 'Seminar: Arduino Insights with Sir Jerico Vilog', Date: new Date('2025-06-06'), Org: null, Description: 'Join us for an insightful seminar on Arduino led by Sir Jerico Vilog. Mark your calendars for June 6th!', Participants: null, Image: 'https://picsum.photos/seed/arduino/400/200', DataAiHint: 'seminar arduino electronics' },
    { AchievementID: 3, Title: 'New Sub-Organization: Algorithm Knights', Date: new Date('2025-06-01'), Org: 'Algorithm Knights', Description: 'Focusing on students participating in competitions under the College of Computer Studies. Hone your problem-solving skills!', Participants: null, Image: 'https://picsum.photos/seed/algo-knights-news/400/200', DataAiHint: 'algorithm knights competition code' },
];

const mockUpcomingEvents: Event[] = [
     { EventID: 3, Title: 'College of Computer Studies Day (CCS)', Date: new Date(2025, 5, 13), EndDate: new Date(2025, 5, 14), Location: 'ICCT Cainta Campus', Description: 'Annual celebration for the College of Computer Studies.', RequiresRegistration: true, RegistrationFee: new Prisma.Decimal(50), RegistrationCount: 0 }, // Example with registration
     { EventID: 4, Title: 'Sports Festival 2025', Date: new Date(2025, 5, 20), EndDate: null, Location: 'Marikina Sports Center', Description: 'Annual sports festival.', RequiresRegistration: false, RegistrationFee: new Prisma.Decimal(0), RegistrationCount: 0 },
];


export default async function Home() {
    let newsItems: Achievement[] = [];
    let upcomingEvents: Event[] = [];

    try {
        // START: TEMPORARILY COMMENTED OUT PRISMA CALLS DUE TO libssl ERROR
        // // Fetch News Items (Using Achievements table for now)
        // newsItems = await prisma.achievement.findMany({
        //    orderBy: { Date: 'desc' },
        //    take: 3,
        //    where: { // Add condition to only show news-like items if applicable
        //         // Example: Assuming a specific 'Org' value indicates news, or add a dedicated 'type' field
        //         // Org: { in: [null, 'CES Announcement'] } // Adjust this condition as needed
        //    }
        // });

        // // Fetch Upcoming Events (limit 2)
        // const now = new Date();
        // now.setHours(0, 0, 0, 0);
        // upcomingEvents = await prisma.event.findMany({
        //     where: {
        //         OR: [
        //             { EndDate: { gte: now } }, // Events ending today or later
        //             { AND: [{ EndDate: null }, { Date: { gte: now } }] } // Single-day events today or later
        //         ],
        //          Date: { not: null } // Ensure Date is not null
        //     },
        //     orderBy: { Date: 'asc' },
        //     take: 2,
        // });
        console.warn("Prisma calls temporarily disabled in Home page due to environment issue (missing libssl). Using mock data.");
        newsItems = mockNewsItems; // Use mock data as fallback
        upcomingEvents = mockUpcomingEvents; // Use mock data as fallback
        // END: TEMPORARILY COMMENTED OUT PRISMA CALLS

    } catch (error) {
         console.error("Failed to fetch data from Prisma (or using fallback):", error);
         // Use mock data as fallback in case of error
         newsItems = mockNewsItems;
         upcomingEvents = mockUpcomingEvents;
         // Optionally, display an error message to the user on the page
    }


    return (
        <div className="container mx-auto px-4 py-8 space-y-12">
            {/* Hero Section */}
            <section className="relative rounded-lg overflow-hidden shadow-lg animate-fadeIn">
                <Image
                    src="https://picsum.photos/seed/hero/1200/400"
                    alt="ICCT CES Hero"
                    width={1200}
                    height={400}
                    className="w-full object-cover h-64 md:h-96"
                    data-ai-hint="college students technology campus"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent flex flex-col justify-end p-6 md:p-10">
                    <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-2 animate-slideInFromLeft">
                        Welcome to CES ANTIPOLO
                    </h1>
                    <p className="text-lg md:text-xl text-primary-foreground/90 mb-4 animate-slideInFromLeft animation-delay-200">
                        Exploring the frontiers of technology together.
                    </p>
                    <Link href="/about" passHref>
                        <Button size="lg" variant="secondary" className="btn-hover-scale animate-scaleUp animation-delay-400">Learn More</Button>
                    </Link>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* News Feed Section */}
                <section className="lg:col-span-2 space-y-6">
                    <h2 className="text-3xl font-semibold flex items-center gap-2">
                        <Newspaper className="text-accent" /> News & Announcements
                    </h2>
                    <div className="space-y-6">
                        {newsItems.map((item) => (
                            <Card key={item.AchievementID} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 animate-fadeIn">
                                {item.Image && (
                                    <CardHeader className="p-0">
                                        <Image
                                            src={item.Image}
                                            alt={item.Title}
                                            width={400}
                                            height={200}
                                            className="w-full h-48 object-cover"
                                            data-ai-hint={item.DataAiHint || "news update article"}
                                        />
                                    </CardHeader>
                                )}
                                <CardContent className="p-6">
                                    <CardTitle className="text-xl mb-2 link-underline-grow inline-block">{item.Title}</CardTitle>
                                    <CardDescription className="text-sm text-muted-foreground mb-3">
                                        {item.Date ? format(item.Date, 'PPP') : 'Date Unknown'} {item.Org ? `| ${item.Org}` : ''}
                                    </CardDescription>
                                    <p className="text-foreground/80 mb-4 line-clamp-3">{item.Description}</p>
                                    {/* Link to actual news detail page if available */}
                                    {/* <Link href={`/news/${item.AchievementID}`} passHref legacyBehavior>
                                        <Button variant="link" className="p-0 h-auto link-underline-grow" asChild><a>Read More</a></Button>
                                    </Link> */}
                                </CardContent>
                            </Card>
                        ))}
                         {newsItems.length === 0 && <p className="text-muted-foreground">No recent news.</p>}
                    </div>
                     {/* Link to a future /news page - Keep commented out if page doesn't exist */}
                     {/* <div className="text-center mt-6">
                         <Link href="/news">
                            <Button variant="outline" className="btn-hover-shadow">View All News</Button>
                        </Link>
                     </div> */}
                </section>

                {/* Upcoming Events Section */}
                <section className="lg:col-span-1 space-y-6">
                    <h2 className="text-3xl font-semibold flex items-center gap-2">
                        <CalendarDays className="text-accent" /> Upcoming Events
                    </h2>
                    <div className="space-y-6">
                        {upcomingEvents.map((event) => (
                            <Card key={event.EventID} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 animate-fadeIn">
                                 {/* Optional: Add image for events if schema supports it */}
                                 {/* {event.Image && (
                                    <CardHeader className="p-0">
                                        <Image
                                            src={event.Image}
                                            alt={event.Title}
                                            width={400}
                                            height={200}
                                            className="w-full h-40 object-cover"
                                            data-ai-hint={"event placeholder"} // Add relevant hint
                                        />
                                    </CardHeader>
                                )} */}
                                <CardContent className="p-6">
                                    <CardTitle className="text-lg mb-1 link-underline-grow inline-block">{event.Title}</CardTitle>
                                    <CardDescription className="text-sm text-muted-foreground mb-2">
                                        {formatDateRange(event.Date, event.EndDate)}
                                    </CardDescription>
                                    <p className="text-sm text-foreground/80">{event.Location || 'Location TBD'}</p>
                                    {/* Optional: Link to event details */}
                                    {/* <Link href={`/events#${event.EventID}`}>
                                       <Button variant="link" size="sm" className="p-0 mt-2 h-auto">Details</Button>
                                    </Link> */}
                                </CardContent>
                            </Card>
                        ))}
                        {upcomingEvents.length === 0 && <p className="text-muted-foreground">No upcoming events.</p>}
                    </div>
                    <div className="text-center mt-6">
                        <Link href="/events">
                            <Button variant="outline" className="btn-hover-shadow">View Calendar</Button>
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
