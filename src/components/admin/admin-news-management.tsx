'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2, Sparkles, Loader2, Eye, EyeOff } from "lucide-react"; // Added Eye icons
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from 'react'; // Added useEffect
import { generateContent, GenerateContentInput } from "@/ai/flows/content-generation-flow"; // Import AI flow
import { Badge } from "@/components/ui/badge"; // Import Badge component
import { format } from 'date-fns'; // Import format
// Assuming a Prisma model named 'NewsArticle' exists
// import type { NewsArticle as PrismaNewsArticle } from '@prisma/client';

// Mock data structure similar to a potential Prisma model
interface MockNewsArticle {
    id: string;
    title: string;
    date: Date | null; // Use Date object
    status: 'Published' | 'Draft';
    content: string | null;
    // Add other fields like authorId, imageURL etc. if needed
}

const mockNewsData: MockNewsArticle[] = [
    { id: 'news1', title: 'Preliminary Exam Approaching', date: new Date('2025-05-04'), status: 'Published', content: 'Prepare for the upcoming Preliminary Examinations starting May 4th until May 7th, 2025.' },
    { id: 'news2', title: 'Seminar: Arduino Insights', date: new Date('2025-06-06'), status: 'Published', content: 'Join us for an insightful seminar on Arduino led by Sir Jerico Vilog. Mark your calendars for June 6th!' },
    { id: 'news3', title: 'New Sub-Organization: Algorithm Knights', date: new Date('2025-06-01'), status: 'Published', content: 'Focusing on students participating in competitions under the College of Computer Studies. Hone your problem-solving skills!' },
    { id: 'news4', title: 'Draft: CCS Day Planning Meeting', date: new Date('2025-05-15'), status: 'Draft', content: 'Initial planning meeting notes for CCS Day.' },
];

// Type for the state, allowing Date or string temporarily for input binding
type EditableNewsArticle = Omit<MockNewsArticle, 'date'> & {
    date?: Date | string | null;
};


export default function AdminNewsManagement() {
    const [articles, setArticles] = useState<MockNewsArticle[]>(mockNewsData); // Use mock data initially
    const [isEditing, setIsEditing] = useState(false);
    const [currentArticle, setCurrentArticle] = useState<Partial<EditableNewsArticle> | null>(null);
    const [isAiGenerating, setIsAiGenerating] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [aiKeyPoints, setAiKeyPoints] = useState('');

    // Fetch news data from API/DB on component mount (example structure)
    // useEffect(() => {
    //     async function fetchNews() {
    //         // Replace with your actual API call
    //         // const response = await fetch('/api/news');
    //         // const data = await response.json();
    //         // setArticles(data.map(article => ({ ...article, date: article.date ? new Date(article.date) : null }))); // Ensure dates are Date objects
    //     }
    //     fetchNews();
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
        setCurrentArticle({ date: new Date().toISOString().split('T')[0], status: 'Draft', title: '', content: '' });
        setAiTopic('');
        setAiKeyPoints('');
    };

    const handleEdit = (article: MockNewsArticle) => {
        setIsEditing(true);
        setCurrentArticle({
            ...article,
            date: article.date ? formatDateForInput(article.date) : '', // Format for input
        });
        setAiTopic(article.title);
        setAiKeyPoints('');
    };

    const handleDelete = async (id: string) => {
        // TODO: Add confirmation dialog
        // Demo: remove from local state
        setArticles(articles.filter(a => a.id !== id));

        // TODO: Call actual delete API
        // try {
        //     const response = await fetch(`/api/news/${id}`, { method: 'DELETE' });
        //     if (!response.ok) throw new Error('Failed to delete article');
        //     // Optionally refetch or rely on local state update
        // } catch (error) {
        //     console.error("Error deleting article:", error);
        //     // Revert state or show error toast
        // }
    };

    const handleSave = async () => {
        if (!currentArticle) return;

        // Validate and prepare data for saving (convert date back)
        const articleDataToSave = {
            ...currentArticle,
            date: currentArticle.date ? new Date(`${currentArticle.date}T00:00:00`) : null,
            status: currentArticle.status || 'Draft', // Ensure status is set
        };

         // Remove id for creation payload if it's a mock temporary ID
        const { id: tempId, ...createData } = articleDataToSave;
        const { id: updateId, ...updateData } = articleDataToSave;


        // TODO: Call actual create or update API
        if (currentArticle.id && mockNewsData.some(a => a.id === currentArticle.id)) { // Check if it's an existing mock ID
            // Update existing (Demo: update local state)
            console.log("Updating article (DEMO):", updateData);
            setArticles(articles.map(a => a.id === currentArticle.id ? articleDataToSave as MockNewsArticle : a));
             // try {
             //     const response = await fetch(`/api/news/${currentArticle.id}`, {
             //         method: 'PUT',
             //         headers: { 'Content-Type': 'application/json' },
             //         body: JSON.stringify(updateData),
             //     });
             //     if (!response.ok) throw new Error('Failed to update article');
             //     const updatedArticle = await response.json();
             //     setArticles(articles.map(a => a.id === updatedArticle.id ? { ...updatedArticle, date: updatedArticle.date ? new Date(updatedArticle.date) : null } : a));
             // } catch (error) {
             //     console.error("Error updating article:", error);
             // }
        } else {
             // Add new (Demo: add to local state with temp ID)
             const newArticle = { ...articleDataToSave, id: `news${Date.now()}` } as MockNewsArticle; // Mock ID
             console.log("Adding new article (DEMO):", newArticle);
             setArticles([...articles, newArticle]);
            // try {
            //     const response = await fetch('/api/news', {
            //         method: 'POST',
            //         headers: { 'Content-Type': 'application/json' },
            //         body: JSON.stringify(createData), // Use data without ID
            //     });
            //     if (!response.ok) throw new Error('Failed to create article');
            //     const createdArticle = await response.json();
            //     setArticles([...articles, { ...createdArticle, date: createdArticle.date ? new Date(createdArticle.date) : null }]);
            // } catch (error) {
            //     console.error("Error creating article:", error);
            // }
        }
        setIsEditing(false);
        setCurrentArticle(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
         if (!currentArticle) return;
         const { name, value } = e.target;
         setCurrentArticle(prev => ({ ...prev, [name]: value }));
    };

     const handleStatusChange = (value: string) => {
         if (!currentArticle) return;
         setCurrentArticle(prev => ({ ...prev, status: value as 'Published' | 'Draft' }));
     };

    const handleGenerateWithAi = async () => {
        if (!aiTopic.trim()) return;
        setIsAiGenerating(true);
        try {
            const input: GenerateContentInput = {
                contentType: 'news_article',
                topic: aiTopic,
                keyPoints: aiKeyPoints.split('\n').filter(p => p.trim() !== ''),
                tone: 'informative',
                length: 'medium'
            };
            const result = await generateContent(input);
            if (result.generatedContent && !result.generatedContent.startsWith('Content generation failed:')) {
                setCurrentArticle(prev => ({
                    ...prev,
                    content: result.generatedContent,
                    title: prev?.title || aiTopic,
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

    const getStatusBadgeVariant = (status: 'Published' | 'Draft') => {
        return status === 'Published' ? 'default' : 'secondary';
    };


    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button onClick={handleAddNew}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Article
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>News & Announcements</CardTitle>
                    <CardDescription>Manage news articles and announcements displayed on the website.</CardDescription>
                </CardHeader>
                <CardContent>
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
                            {articles.map((news) => (
                                <TableRow key={news.id}>
                                    <TableCell className="font-medium">{news.title}</TableCell>
                                    <TableCell>{news.date ? format(news.date, 'PPP') : 'N/A'}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(news.status)} className={news.status === 'Published' ? 'bg-green-600' : ''}>
                                            {news.status === 'Published' ? <Eye className="mr-1 h-3 w-3" /> : <EyeOff className="mr-1 h-3 w-3" />}
                                            {news.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-1">
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(news)} title="Edit Article">
                                            <Edit className="h-4 w-4" />
                                            <span className="sr-only">Edit</span>
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(news.id)} title="Delete Article">
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Delete</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                             {articles.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                                        No news articles found.
                                    </TableCell>
                                </TableRow>
                             )}
                        </TableBody>
                    </Table>
                     <p className="text-xs text-muted-foreground mt-4">* This interface uses mock data. Database integration is required.</p>
                </CardContent>
            </Card>

             {/* Add/Edit Dialog */}
             <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>{currentArticle?.id && mockNewsData.some(a => a.id === currentArticle.id) ? 'Edit Article' : 'Add New Article'}</DialogTitle>
                        <DialogDescription>
                            Fill in the details for the news article. Use the AI generator for the content.
                        </DialogDescription>
                    </DialogHeader>
                     <div className="flex-1 overflow-y-auto pr-2">
                        {currentArticle && (
                            <div className="grid gap-6 py-4">
                                {/* AI Generation Section */}
                                 <Card className="bg-muted/50">
                                     <CardHeader className="pb-2">
                                         <CardTitle className="text-lg flex items-center gap-2">
                                             <Sparkles className="h-5 w-5 text-primary" /> AI Content Generator
                                         </CardTitle>
                                         <CardDescription>Generate article content based on a topic and key points.</CardDescription>
                                     </CardHeader>
                                     <CardContent className="space-y-3">
                                         <div className="grid gap-2">
                                             <Label htmlFor="ai-topic">Topic / Title</Label>
                                             <Input
                                                 id="ai-topic"
                                                 placeholder="e.g., Upcoming Web Dev Seminar"
                                                 value={aiTopic}
                                                 onChange={(e) => setAiTopic(e.target.value)}
                                                 disabled={isAiGenerating}
                                             />
                                         </div>
                                         <div className="grid gap-2">
                                             <Label htmlFor="ai-key-points">Key Points (one per line)</Label>
                                             <Textarea
                                                 id="ai-key-points"
                                                 placeholder="e.g., Date: June 15th\nLocation: Room 301\nSpeaker: Jane Doe"
                                                 value={aiKeyPoints}
                                                 onChange={(e) => setAiKeyPoints(e.target.value)}
                                                 rows={3}
                                                 disabled={isAiGenerating}
                                             />
                                         </div>
                                         <Button onClick={handleGenerateWithAi} disabled={isAiGenerating || !aiTopic.trim()} size="sm">
                                             {isAiGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                             {isAiGenerating ? 'Generating...' : 'Generate Content'}
                                         </Button>
                                         <p className="text-xs text-muted-foreground">
                                             Generated content will fill the 'Content' field below. You can then edit it.
                                         </p>
                                     </CardContent>
                                 </Card>


                                 {/* Form Fields */}
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input id="title" name="title" value={currentArticle.title || ''} onChange={handleInputChange} required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                     <div className="grid gap-2">
                                        <Label htmlFor="date">Date</Label>
                                        <Input id="date" name="date" type="date" value={formatDateForInput(currentArticle.date)} onChange={handleInputChange} required />
                                     </div>
                                      <div className="grid gap-2">
                                         <Label htmlFor="status">Status</Label>
                                         <Select name="status" value={currentArticle.status || 'Draft'} onValueChange={handleStatusChange}>
                                             <SelectTrigger id="status">
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
                                     <Label htmlFor="content">Content</Label>
                                     {/* TODO: Replace with a Rich Text Editor */}
                                     <Textarea id="content" name="content" value={currentArticle.content || ''} onChange={handleInputChange} rows={10} required />
                                 </div>
                                 {/* TODO: Add image upload field */}
                             </div>
                        )}
                    </div>
                    <DialogFooter className="pt-4 border-t">
                         <DialogClose asChild>
                             <Button type="button" variant="outline">Cancel</Button>
                         </DialogClose>
                        <Button type="button" onClick={handleSave}>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
