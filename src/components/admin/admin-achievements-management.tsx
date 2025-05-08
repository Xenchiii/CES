'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
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
import { useState, useEffect } from "react"; // Added useEffect
import { format } from 'date-fns';
import type { Achievement as PrismaAchievement } from '@prisma/client'; // Import Prisma type
import { Prisma } from '@prisma/client'; // Import Prisma namespace

// Mock data structure matching Prisma schema (Dates as Date objects)
const mockAchievementsData: PrismaAchievement[] = [
  { AchievementID: 1, Title: '1st Place - Regional Programming Contest', Date: new Date('2024-11-15'), Org: 'Code Warriors', Description: 'Secured top spot.', Participants: 'R. Zapanta, R. Baluyot', Image: 'https://picsum.photos/seed/achievement1/600/300', DataAiHint: 'trophy' },
  { AchievementID: 2, Title: 'Best UI/UX Design - University App Challenge', Date: new Date('2024-10-20'), Org: 'Digital Expressionists', Description: 'Won Best UI/UX award.', Participants: 'D. Joven, M. Catabuena', Image: 'https://picsum.photos/seed/achievement2/600/300', DataAiHint: 'design award' },
  { AchievementID: 3, Title: 'Community Choice Award - AI Innovation Fair', Date: new Date('2024-09-05'), Org: 'AI Mentors', Description: 'Received community choice.', Participants: 'F. Carigma', Image: 'https://picsum.photos/seed/achievement3/600/300', DataAiHint: 'ai award' },
];

// Type for the state, allowing Date or string temporarily for input binding
type EditableAchievement = Omit<PrismaAchievement, 'Date'> & {
    Date?: Date | string | null;
};

export default function AdminAchievementsManagement() {
    const [achievements, setAchievements] = useState<PrismaAchievement[]>(mockAchievementsData); // Use mock data initially
    const [isEditing, setIsEditing] = useState(false);
    const [currentAchievement, setCurrentAchievement] = useState<Partial<EditableAchievement> | null>(null);

    // Fetch achievements data from API/DB on component mount (example structure)
    // useEffect(() => {
    //     async function fetchAchievements() {
    //         // Replace with your actual API call
    //         // const response = await fetch('/api/achievements');
    //         // const data = await response.json();
    //         // setAchievements(data.map(ach => ({ ...ach, Date: ach.Date ? new Date(ach.Date) : null }))); // Ensure dates are Date objects
    //     }
    //     fetchAchievements();
    // }, []);


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
         setCurrentAchievement({ Date: new Date().toISOString().split('T')[0], Title: '', Description: '', Participants: '', Org: '', Image: '', DataAiHint: '' });
     };

     const handleEdit = (achievement: PrismaAchievement) => {
         setIsEditing(true);
         setCurrentAchievement({
            ...achievement,
            Date: achievement.Date ? formatDateForInput(achievement.Date) : '', // Format date for input
         });
     };

     const handleDelete = async (id: number) => {
         // TODO: Add confirmation dialog
         // For demo: Remove from local state
         setAchievements(achievements.filter(a => a.AchievementID !== id));

         // TODO: Call actual delete API
         // try {
         //     const response = await fetch(`/api/achievements/${id}`, { method: 'DELETE' });
         //     if (!response.ok) throw new Error('Failed to delete achievement');
         //     // Optionally refetch or rely on local state update
         // } catch (error) {
         //     console.error("Error deleting achievement:", error);
         //     // Revert state or show error toast
         // }
     };

     const handleSave = async () => {
         if (!currentAchievement) return;

         // Validate and prepare data for saving (convert date back)
         const achievementDataToSave = {
             ...currentAchievement,
             Date: currentAchievement.Date ? new Date(`${currentAchievement.Date}T00:00:00`) : null,
         };

         // Remove AchievementID for creation payload
         const { AchievementID, ...createData } = achievementDataToSave;
         const { AchievementID: updateId, ...updateData } = achievementDataToSave;

         // TODO: Call actual create or update API
         if (currentAchievement.AchievementID) {
             // Update existing (Demo: update local state)
             console.log("Updating achievement (DEMO):", updateData);
             setAchievements(achievements.map(a => a.AchievementID === currentAchievement.AchievementID ? achievementDataToSave as PrismaAchievement : a));
             // try {
             //     const response = await fetch(`/api/achievements/${currentAchievement.AchievementID}`, {
             //         method: 'PUT',
             //         headers: { 'Content-Type': 'application/json' },
             //         body: JSON.stringify(updateData),
             //     });
             //     if (!response.ok) throw new Error('Failed to update achievement');
             //     const updatedAch = await response.json();
             //     setAchievements(achievements.map(a => a.AchievementID === updatedAch.AchievementID ? { ...updatedAch, Date: updatedAch.Date ? new Date(updatedAch.Date) : null } : a));
             // } catch (error) {
             //     console.error("Error updating achievement:", error);
             // }
         } else {
             // Add new (Demo: add to local state)
             const newAchievement = { ...achievementDataToSave, AchievementID: Date.now() } as PrismaAchievement; // Mock ID
             console.log("Adding new achievement (DEMO):", newAchievement);
             setAchievements([...achievements, newAchievement]);
             // try {
             //     const response = await fetch('/api/achievements', {
             //         method: 'POST',
             //         headers: { 'Content-Type': 'application/json' },
             //         body: JSON.stringify(createData),
             //     });
             //     if (!response.ok) throw new Error('Failed to create achievement');
             //     const createdAch = await response.json();
             //     setAchievements([...achievements, { ...createdAch, Date: createdAch.Date ? new Date(createdAch.Date) : null }]);
             // } catch (error) {
             //     console.error("Error creating achievement:", error);
             // }
         }
         setIsEditing(false);
         setCurrentAchievement(null);
     };

      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
         if (!currentAchievement) return;
         const { name, value } = e.target;
         setCurrentAchievement(prev => ({ ...prev, [name]: value }));
      };


    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button onClick={handleAddNew}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Achievement
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                    <CardDescription>Manage achievements showcased on the website.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Organization/Individual</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {achievements.map((achievement) => (
                                <TableRow key={achievement.AchievementID}>
                                    <TableCell className="font-medium">{achievement.Title}</TableCell>
                                    <TableCell>{achievement.Date ? format(achievement.Date, 'PPP') : 'N/A'}</TableCell>
                                    <TableCell>{achievement.Org || 'Individual'}</TableCell>
                                    <TableCell className="text-right space-x-1">
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(achievement)} title="Edit Achievement">
                                            <Edit className="h-4 w-4" />
                                            <span className="sr-only">Edit</span>
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(achievement.AchievementID)} title="Delete Achievement">
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Delete</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                             {achievements.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                                        No achievements found.
                                    </TableCell>
                                </TableRow>
                             )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Add/Edit Achievement Dialog */}
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>{currentAchievement?.AchievementID ? 'Edit Achievement' : 'Add New Achievement'}</DialogTitle>
                        <DialogDescription>
                            Enter the details for the achievement.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto pr-2">
                        {currentAchievement && (
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="ach-title">Title</Label>
                                    <Input id="ach-title" name="Title" value={currentAchievement.Title || ''} onChange={handleInputChange} required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="ach-date">Date</Label>
                                    <Input id="ach-date" name="Date" type="date" value={formatDateForInput(currentAchievement.Date)} onChange={handleInputChange} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="ach-org">Organization/Individual</Label>
                                    <Input id="ach-org" name="Org" value={currentAchievement.Org || ''} onChange={handleInputChange} placeholder="e.g., Code Warriors or John Doe" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="ach-description">Description</Label>
                                    <Textarea id="ach-description" name="Description" value={currentAchievement.Description || ''} onChange={handleInputChange} rows={3} />
                                </div>
                                 <div className="grid gap-2">
                                    <Label htmlFor="ach-participants">Participants (comma-separated)</Label>
                                    <Input id="ach-participants" name="Participants" value={currentAchievement.Participants || ''} onChange={handleInputChange} placeholder="e.g., Jane D., Peter S." />
                                </div>
                                 <div className="grid gap-2">
                                    <Label htmlFor="ach-image">Image URL</Label>
                                    <Input id="ach-image" name="Image" value={currentAchievement.Image || ''} onChange={handleInputChange} placeholder="https://example.com/image.jpg" />
                                    {/* TODO: Implement proper file upload */}
                                </div>
                                 <div className="grid gap-2">
                                    <Label htmlFor="ach-ai-hint">Image AI Hint (for placeholder)</Label>
                                    <Input id="ach-ai-hint" name="DataAiHint" value={currentAchievement.DataAiHint || ''} onChange={handleInputChange} placeholder="e.g., trophy award competition" />
                                </div>
                             </div>
                        )}
                    </div>
                    <DialogFooter className="pt-4 border-t">
                        <DialogClose asChild>
                           <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="button" onClick={handleSave}>Save Achievement</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
