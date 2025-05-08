'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash2, Eye, EyeOff, CalendarDays } from 'lucide-react';
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

interface ProfessorActivitiesManagementProps {
  course: Course;
}

interface Activity {
  id: string;
  courseSlug: string;
  title: string;
  type: 'Assignment' | 'Quiz' | 'Project' | 'Other';
  dueDate: Date | null;
  status: 'Draft' | 'Published';
  description: string | null;
}

const mockActivities: Activity[] = [
  { id: 'act1', courseSlug: 'social-prof-issues-1', title: 'Ethics Case Study Analysis', type: 'Assignment', dueDate: new Date(Date.now() + 7 * 86400000), status: 'Published', description: 'Analyze the provided case study on AI ethics.' },
  { id: 'act2', courseSlug: 'social-prof-issues-1', title: 'Quiz 1: Professional Codes of Conduct', type: 'Quiz', dueDate: new Date(Date.now() + 3 * 86400000), status: 'Published', description: 'Short quiz on ACM and IEEE codes.' },
  { id: 'act3', courseSlug: 'info-management-1', title: 'Database Design Project Proposal', type: 'Project', dueDate: new Date(Date.now() + 14 * 86400000), status: 'Draft', description: 'Submit a proposal for your semester project.' },
];

type EditableActivity = Omit<Activity, 'dueDate'> & {
  dueDate?: string | null; // For input binding
};

export default function ProfessorActivitiesManagement({ course }: ProfessorActivitiesManagementProps) {
  const [activities, setActivities] = useState<Activity[]>(() => mockActivities.filter(act => act.courseSlug === course.slug));
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<Partial<EditableActivity> | null>(null);

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
    setCurrentActivity({ courseSlug: course.slug, status: 'Draft', title: '', type: 'Assignment', description: '', dueDate: new Date().toISOString().split('T')[0] });
    setIsFormOpen(true);
  };

  const handleEdit = (activity: Activity) => {
    setCurrentActivity({
      ...activity,
      dueDate: activity.dueDate ? formatDateForInput(activity.dueDate) : '',
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    // TODO: Implement actual delete API call
    setActivities(prev => prev.filter(act => act.id !== id));
    // alert(`Mock delete activity ${id}`);
  };

  const handleSave = () => {
    if (!currentActivity) return;

    const activityDataToSave: Activity = {
      ...currentActivity,
      id: currentActivity.id || `act${Date.now()}`, // Assign new ID if creating
      courseSlug: course.slug,
      type: currentActivity.type || 'Assignment',
      status: currentActivity.status || 'Draft',
      dueDate: currentActivity.dueDate ? new Date(`${currentActivity.dueDate}T00:00:00`) : null,
    } as Activity;


    if (currentActivity.id) {
      // Update
      setActivities(prev => prev.map(act => act.id === activityDataToSave.id ? activityDataToSave : act));
    } else {
      // Create
      setActivities(prev => [...prev, activityDataToSave]);
    }
    setIsFormOpen(false);
    setCurrentActivity(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!currentActivity) return;
    const { name, value } = e.target;
    setCurrentActivity(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof EditableActivity, value: string) => {
    if (!currentActivity) return;
    setCurrentActivity(prev => ({ ...prev, [name]: value as any }));
  };
  
  const getStatusBadgeVariant = (status: 'Published' | 'Draft') => {
    return status === 'Published' ? 'default' : 'secondary';
  };


  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Activity
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.length > 0 ? activities.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell className="font-medium">{activity.title}</TableCell>
              <TableCell>{activity.type}</TableCell>
              <TableCell>{activity.dueDate ? format(activity.dueDate, 'PPP') : 'N/A'}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(activity.status)} className={activity.status === 'Published' ? 'bg-green-600' : ''}>
                  {activity.status === 'Published' ? <Eye className="mr-1 h-3 w-3" /> : <EyeOff className="mr-1 h-3 w-3" />}
                  {activity.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(activity)} title="Edit Activity">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(activity.id)} title="Delete Activity">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No activities found for this course.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{currentActivity?.id ? 'Edit Activity' : 'Create New Activity'}</DialogTitle>
            <DialogDescription>
              For course: {course.title}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-2">
            {currentActivity && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="act-title">Title</Label>
                  <Input id="act-title" name="title" value={currentActivity.title || ''} onChange={handleInputChange} required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="act-type">Type</Label>
                        <Select name="type" value={currentActivity.type || 'Assignment'} onValueChange={(val) => handleSelectChange('type', val)}>
                        <SelectTrigger id="act-type">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Assignment">Assignment</SelectItem>
                            <SelectItem value="Quiz">Quiz</SelectItem>
                            <SelectItem value="Project">Project</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="act-status">Status</Label>
                        <Select name="status" value={currentActivity.status || 'Draft'} onValueChange={(val) => handleSelectChange('status', val)}>
                        <SelectTrigger id="act-status">
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
                  <Label htmlFor="act-dueDate">Due Date</Label>
                  <Input id="act-dueDate" name="dueDate" type="date" value={formatDateForInput(currentActivity.dueDate)} onChange={handleInputChange} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="act-description">Description</Label>
                  <Textarea id="act-description" name="description" value={currentActivity.description || ''} onChange={handleInputChange} rows={4} />
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="pt-4 border-t">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleSave}>Save Activity</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
