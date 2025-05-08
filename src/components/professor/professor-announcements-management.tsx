'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface Course {
  slug: string;
  title: string;
}

interface ProfessorAnnouncementsManagementProps {
  course: Course;
}

interface Announcement {
  id: string;
  courseSlug: string;
  title: string;
  content: string;
  date: Date;
  status: 'Draft' | 'Published';
}

const mockAnnouncements: Announcement[] = [
  { id: 'ann1', courseSlug: 'social-prof-issues-1', title: 'Reminder: Ethics Paper Due Next Week', content: 'Please remember that your ethics paper is due by the end of next week. Refer to the LMS for submission guidelines.', date: new Date(), status: 'Published' },
  { id: 'ann2', courseSlug: 'social-prof-issues-1', title: 'Midterm Grades Posted (Draft)', content: 'Midterm grades for Social and Professional Issues 1 are now available for review (draft).', date: new Date(Date.now() - 86400000), status: 'Draft' },
  { id: 'ann3', courseSlug: 'info-management-1', title: 'Upcoming Guest Lecture on NoSQL Databases', content: 'We will have a guest lecture on NoSQL databases next Friday. Attendance is highly encouraged.', date: new Date(), status: 'Published' },
];

type EditableAnnouncement = Omit<Announcement, 'date'> & {
  date?: string | null; // For input binding
};


export default function ProfessorAnnouncementsManagement({ course }: ProfessorAnnouncementsManagementProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => mockAnnouncements.filter(ann => ann.courseSlug === course.slug));
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Partial<EditableAnnouncement> | null>(null);

  const formatDateForInput = (date: Date | string | undefined | null): string => {
    if (!date) return '';
    try {
      const dateObj = typeof date === 'string' ? new Date(`${date}T00:00:00`) : date;
      return format(dateObj, 'yyyy-MM-dd');
    } catch {
      return '';
    }
  };

  const handleAddNew = () => {
    setCurrentAnnouncement({ courseSlug: course.slug, status: 'Draft', title: '', content: '', date: new Date().toISOString().split('T')[0] });
    setIsFormOpen(true);
  };

  const handleEdit = (announcement: Announcement) => {
    setCurrentAnnouncement({
      ...announcement,
      date: formatDateForInput(announcement.date),
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    // TODO: Implement actual delete API call
    setAnnouncements(prev => prev.filter(ann => ann.id !== id));
    // alert(`Mock delete announcement ${id}`);
  };

  const handleSave = () => {
    if (!currentAnnouncement) return;
    
    const announcementDataToSave: Announcement = {
      ...currentAnnouncement,
      id: currentAnnouncement.id || `ann${Date.now()}`, // Assign new ID if creating
      courseSlug: course.slug,
      status: currentAnnouncement.status || 'Draft',
      date: currentAnnouncement.date ? new Date(`${currentAnnouncement.date}T00:00:00`) : new Date(),
    } as Announcement;

    if (currentAnnouncement.id) {
      // Update
      setAnnouncements(prev => prev.map(ann => ann.id === announcementDataToSave.id ? announcementDataToSave : ann));
    } else {
      // Create
      setAnnouncements(prev => [...prev, announcementDataToSave]);
    }
    setIsFormOpen(false);
    setCurrentAnnouncement(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!currentAnnouncement) return;
    const { name, value } = e.target;
    setCurrentAnnouncement(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: 'Draft' | 'Published') => {
    if (!currentAnnouncement) return;
    setCurrentAnnouncement(prev => ({ ...prev, status: value }));
  };
  
  const getStatusBadgeVariant = (status: 'Published' | 'Draft') => {
    return status === 'Published' ? 'default' : 'secondary';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Announcement
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {announcements.length > 0 ? announcements.map((announcement) => (
            <TableRow key={announcement.id}>
              <TableCell className="font-medium">{announcement.title}</TableCell>
              <TableCell>{format(announcement.date, 'PPP')}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(announcement.status)} className={announcement.status === 'Published' ? 'bg-green-600' : ''}>
                   {announcement.status === 'Published' ? <Eye className="mr-1 h-3 w-3" /> : <EyeOff className="mr-1 h-3 w-3" />}
                  {announcement.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(announcement)} title="Edit Announcement">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(announcement.id)} title="Delete Announcement">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No announcements found for this course.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{currentAnnouncement?.id ? 'Edit Announcement' : 'Create New Announcement'}</DialogTitle>
            <DialogDescription>
              For course: {course.title}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-2">
            {currentAnnouncement && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="ann-title">Title</Label>
                  <Input id="ann-title" name="title" value={currentAnnouncement.title || ''} onChange={handleInputChange} required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="ann-date">Date</Label>
                        <Input id="ann-date" name="date" type="date" value={formatDateForInput(currentAnnouncement.date)} onChange={handleInputChange} required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="ann-status">Status</Label>
                        <Select name="status" value={currentAnnouncement.status || 'Draft'} onValueChange={handleStatusChange as any}>
                        <SelectTrigger id="ann-status">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Draft">Draft</SelectItem>
                            <SelectItem value="Published">Published</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ann-content">Content</Label>
                  <Textarea id="ann-content" name="content" value={currentAnnouncement.content || ''} onChange={handleInputChange} rows={6} />
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="pt-4 border-t">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleSave}>Save Announcement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
