import prisma from '@/lib/prisma'; // Use aliased path
// import { Prisma } from '@prisma/client'; // Import Prisma namespace
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Trophy, Award, CalendarDays, Users } from 'lucide-react';
import { format } from 'date-fns'; // Import format
import type { Achievement } from '@prisma/client'; // Keep type import

export default async function AchievementsPage() {
    let achievements: Achievement[] = [];

    try {
        // START: TEMPORARILY COMMENTED OUT PRISMA CALLS DUE TO libssl ERROR
        // // Fetch achievements data from the database
        // achievements = await prisma.achievement.findMany({
        //     orderBy: {
        //         Date: 'desc', // Sort by date descending
        //     },
        // });
        console.warn("Prisma calls temporarily disabled in Achievements page due to environment issue (missing libssl).");
        achievements = []; // Use empty array as fallback
        // END: TEMPORARILY COMMENTED OUT PRISMA CALLS

    } catch(error) {
        console.error("Failed to fetch achievements data (or using fallback):", error);
        // Keep achievements as an empty array
        achievements = [];
        // In a real app, you might want to show an error message to the user
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-12">
            <h1 className="text-4xl font-bold text-center mb-10 flex items-center justify-center gap-3 animate-fadeIn">
                <Trophy className="text-accent h-9 w-9" /> Achievements & Recognition
            </h1>
            <p className="text-center text-lg text-muted-foreground mb-12 max-w-3xl mx-auto animate-fadeIn animation-delay-100">
                Celebrating the successes and milestones of our members and sub-organizations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {achievements.map((achievement, index) => (
                    <Card key={achievement.AchievementID} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 animate-scaleUp" style={{ animationDelay: `${index * 0.1}s` }}>
                        {achievement.Image && (
                            <CardHeader className="p-0">
                                <Image
                                    src={achievement.Image}
                                    alt={achievement.Title}
                                    width={600}
                                    height={300}
                                    className="w-full h-56 object-cover"
                                    data-ai-hint={achievement.DataAiHint || 'achievement award recognition'}
                                />
                            </CardHeader>
                        )}
                        <CardContent className="p-6">
                            <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                                <Award className="h-6 w-6 text-primary flex-shrink-0" /> {achievement.Title}
                            </CardTitle>
                            <CardDescription className="text-sm text-muted-foreground mb-3 flex items-center gap-1.5">
                                <CalendarDays className="h-4 w-4" /> {achievement.Date ? format(achievement.Date, 'PPP') : 'Date Unknown'} {achievement.Org && `| ${achievement.Org}`}
                            </CardDescription>
                            <p className="text-foreground/80 mb-4">{achievement.Description}</p>
                            {achievement.Participants && achievement.Participants.length > 0 && (
                                <div>
                                    <h4 className="font-semibold mb-1 flex items-center gap-1.5"><Users className="h-4 w-4" /> Participants:</h4>
                                    {/* Assuming Participants is stored as comma-separated string */}
                                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                                        {achievement.Participants.split(',').map((participant, pIndex) => (
                                            <li key={pIndex}>{participant.trim()}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {achievements.length === 0 && (
                <Card className="animate-fadeIn animation-delay-200">
                    <CardContent className="pt-6 text-center">
                        <p className="text-muted-foreground">No achievements posted yet. Check back soon!</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

