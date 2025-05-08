import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Star, Award } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Mock Data - Replace with actual data fetching later
const leaderboardData = [
  { rank: 1, name: 'R. Zapanta', points: 150, avatarSeed: 'dev3', recentAchievement: '1st Place - Regional Programming Contest' },
  { rank: 2, name: 'D. Joven', points: 120, avatarSeed: 'icso1', recentAchievement: 'Best UI/UX Design - University App Challenge' },
  { rank: 3, name: 'F. Carigma', points: 100, avatarSeed: 'icso7', recentAchievement: 'Community Choice Award - AI Innovation Fair' },
  { rank: 4, name: 'A. Remiendo', points: 90, avatarSeed: 'officer6', recentAchievement: 'Top Presenter - Algorithm Knights Challenge' },
  { rank: 5, name: 'P. Cartoja', points: 85, avatarSeed: 'officer9', recentAchievement: 'Winner - GHZ Builders Showcase' },
];

export default function AchievementLeaderboardPage() {
  // TODO: Add filtering/sorting options if needed

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <h1 className="text-4xl font-bold text-center mb-8 flex items-center justify-center gap-3 animate-fadeIn">
        <Trophy className="text-accent h-9 w-9" /> Achievement Leaderboard
      </h1>
       <p className="text-center text-lg text-muted-foreground mb-12 max-w-3xl mx-auto animate-fadeIn animation-delay-100">
         Celebrating the top achievers in the ICCT CES community. Points are awarded for various contributions and accomplishments.
       </p>

       <Card className="shadow-xl animate-scaleUp animation-delay-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Star className="h-6 w-6 text-primary"/> Top Members</CardTitle>
            </CardHeader>
            <CardContent>
               <Table>
                  <TableHeader>
                      <TableRow>
                         <TableHead className="w-[50px]">Rank</TableHead>
                         <TableHead>Member</TableHead>
                         <TableHead>Recent Achievement</TableHead>
                         <TableHead className="text-right">Points</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboardData.map((member, index) => (
                       <TableRow key={member.name} className="animate-fadeIn" style={{ animationDelay: `${(index + 3) * 0.1}s` }}>
                           <TableCell className="font-bold text-lg">{member.rank}</TableCell>
                           <TableCell>
                              <div className="flex items-center gap-3">
                                  <Avatar className="h-9 w-9 border">
                                     <AvatarImage src={`https://picsum.photos/seed/${member.avatarSeed}/40/40`} alt={member.name} />
                                     <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium">{member.name}</span>
                              </div>
                           </TableCell>
                           <TableCell className="text-sm text-muted-foreground">{member.recentAchievement}</TableCell>
                           <TableCell className="text-right font-semibold text-primary">{member.points}</TableCell>
                       </TableRow>
                    ))}
                  </TableBody>
               </Table>
               <p className="text-xs text-muted-foreground mt-4">* Leaderboard data is mock data. A points system and backend logic are required for real implementation.</p>
            </CardContent>
       </Card>

       {/* TODO: Add sections for different categories or historical data if needed */}

    </div>
  );
}
