'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Import Table components
import { Users, Settings, Edit, Trash2, List } from "lucide-react";
import { useState, useEffect } from "react"; // Added useEffect
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
import { Textarea } from "@/components/ui/textarea"; // Use Textarea for description
import type { SubOrganization as PrismaSubOrg } from '@prisma/client'; // Import Prisma type

// Mock data structure matching Prisma schema
const mockSubOrgsData: PrismaSubOrg[] = [
    { SubOrgID: 1, Slug: 'ai-mentors', Name: 'AI Mentors', Leader: 'Frederick C.', Description: 'Focuses on AI and ML.' },
    { SubOrgID: 2, Slug: 'algorithm-knights', Name: 'Algorithm Knights', Leader: 'Amalia R.', Description: 'Competitive programming.' },
    { SubOrgID: 3, Slug: 'code-warriors', Name: 'Code Warriors', Leader: 'Ronald Z.', Description: 'Software development practices.' },
    { SubOrgID: 4, Slug: 'digital-expressionists', Name: 'Digital Expressionists', Leader: 'Diana J.', Description: 'Digital art and UI/UX.' },
    { SubOrgID: 5, Slug: 'ghz-builders', Name: 'GHZ Builders', Leader: 'Princess C.', Description: 'Hardware and PC building.' },
    { SubOrgID: 6, Slug: 'web-arachnids', Name: 'Web Arachnids', Leader: 'Rica A.', Description: 'Web development.' },
];

export default function AdminSubOrgManagement() {
    const [subOrgs, setSubOrgs] = useState<PrismaSubOrg[]>(mockSubOrgsData); // Use mock data initially
    const [isEditing, setIsEditing] = useState(false);
    const [currentSubOrg, setCurrentSubOrg] = useState<Partial<PrismaSubOrg> | null>(null);

    // Fetch sub-orgs data from API/DB on component mount (example structure)
    // useEffect(() => {
    //     async function fetchSubOrgs() {
    //         // Replace with your actual API call
    //         // const response = await fetch('/api/suborgs');
    //         // const data = await response.json();
    //         // setSubOrgs(data);
    //     }
    //     fetchSubOrgs();
    // }, []);

    const handleEditSubOrg = (org: PrismaSubOrg) => {
        setCurrentSubOrg({...org});
        setIsEditing(true);
    };

    const handleSaveChanges = async () => {
        if (!currentSubOrg) return;
        console.log("Saving sub-org changes (DEMO):", currentSubOrg);

        const { SubOrgID, ...updateData } = currentSubOrg; // Prepare data for API

        // TODO: Call API to update sub-org details
        // try {
        //     const response = await fetch(`/api/suborgs/${SubOrgID}`, {
        //         method: 'PUT',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify(updateData),
        //     });
        //     if (!response.ok) throw new Error('Failed to update sub-org');
        //     const updatedOrg = await response.json();
        //     setSubOrgs(orgs => orgs.map(o => o.SubOrgID === updatedOrg.SubOrgID ? updatedOrg : o));
        // } catch (error) {
        //     console.error("Error updating sub-org:", error);
        // }

        // For demo: update local state
        setSubOrgs(orgs => orgs.map(o => o.SubOrgID === currentSubOrg.SubOrgID ? currentSubOrg as PrismaSubOrg : o));

        setIsEditing(false);
        setCurrentSubOrg(null);
    };

     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
         if (!currentSubOrg) return;
         const { name, value } = e.target;
         setCurrentSubOrg(prev => ({ ...prev, [name]: value }));
      };


    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Sub-Organization Management</CardTitle>
                    <CardDescription>View and manage sub-organization details. (Leader-specific tools TBD).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <p className="text-sm text-muted-foreground">
                         Currently, only basic details can be viewed/edited by admins. Functionality for sub-organization leaders is planned.
                     </p>
                    <Table>
                         <TableHeader>
                             <TableRow>
                                 <TableHead>Name</TableHead>
                                 <TableHead>Leader</TableHead>
                                 <TableHead>Description</TableHead>
                                 <TableHead className="text-right">Actions</TableHead>
                             </TableRow>
                         </TableHeader>
                         <TableBody>
                            {subOrgs.map(org => (
                                <TableRow key={org.SubOrgID}>
                                     <TableCell className="font-medium">{org.Name}</TableCell>
                                     <TableCell>{org.Leader || 'N/A'}</TableCell>
                                     <TableCell className="text-xs max-w-xs truncate">{org.Description}</TableCell>
                                     <TableCell className="text-right space-x-1">
                                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditSubOrg(org)} title="Edit Details">
                                              <Edit className="h-4 w-4" />
                                              <span className="sr-only">Edit</span>
                                          </Button>
                                          {/* Delete functionality might be complex due to relations */}
                                          {/* <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" title="Delete Sub-Org" disabled> */}
                                          {/*     <Trash2 className="h-4 w-4" /> */}
                                          {/*     <span className="sr-only">Delete</span> */}
                                          {/* </Button> */}
                                     </TableCell>
                                </TableRow>
                             ))}
                             {subOrgs.length === 0 && (
                                  <TableRow>
                                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                                          No sub-organizations configured.
                                      </TableCell>
                                  </TableRow>
                             )}
                         </TableBody>
                     </Table>
                </CardContent>
            </Card>

            {/* Edit Sub-Org Dialog */}
             <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Sub-Organization</DialogTitle>
                        <DialogDescription>
                            Update the details for {currentSubOrg?.Name}.
                        </DialogDescription>
                    </DialogHeader>
                    {currentSubOrg && (
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="suborg-name">Name</Label>
                                <Input id="suborg-name" name="Name" value={currentSubOrg.Name || ''} onChange={handleInputChange} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="suborg-slug">Slug (URL Path)</Label>
                                <Input id="suborg-slug" name="Slug" value={currentSubOrg.Slug || ''} onChange={handleInputChange} required pattern="[a-z0-9\-]+" title="Lowercase letters, numbers, and hyphens only." />
                                <p className="text-xs text-muted-foreground">Used in the URL, e.g., /sub-orgs/ai-mentors</p>
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="suborg-leader">Leader</Label>
                                <Input id="suborg-leader" name="Leader" value={currentSubOrg.Leader || ''} onChange={handleInputChange} />
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="suborg-description">Description</Label>
                                <Textarea id="suborg-description" name="Description" value={currentSubOrg.Description || ''} onChange={handleInputChange} rows={3} />
                            </div>
                            {/* TODO: Add fields for Icon selection/upload if needed */}
                         </div>
                    )}
                    <DialogFooter>
                         <DialogClose asChild>
                             <Button type="button" variant="outline">Cancel</Button>
                         </DialogClose>
                        <Button type="button" onClick={handleSaveChanges}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
