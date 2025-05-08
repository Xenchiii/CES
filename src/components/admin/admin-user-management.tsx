'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge"; // Import Badge component
import { Search, UserCog, CheckCircle, XCircle, Filter } from "lucide-react";
import { useState, useEffect } from "react"; // Added useEffect
import { format } from 'date-fns'; // Import format
// Assuming a Prisma model named 'User' with Role and Status enums
// import type { User as PrismaUser, Role, Status } from '@prisma/client';

// Mock data structure similar to Prisma User model
interface MockUser {
    UserID: number; // Changed from id to UserID to match schema
    Name: string | null;
    Email: string;
    Role: 'Admin' | 'Officer' | 'Member';
    Status: 'Active' | 'Inactive';
    LastLogin: Date | null;
    // Add other fields from your User model if needed
}

const mockUsersData: MockUser[] = [
    { UserID: 1, Name: 'Lian Mae P.', Email: 'lian@example.com', Role: 'Officer', Status: 'Active', LastLogin: new Date(Date.now() - 86400000) },
    { UserID: 2, Name: 'Ronald Z.', Email: 'ronald@example.com', Role: 'Member', Status: 'Active', LastLogin: new Date(Date.now() - 86400000 * 3) },
    { UserID: 3, Name: 'Amalia R.', Email: 'amalia@example.com', Role: 'Member', Status: 'Active', LastLogin: new Date() },
    { UserID: 4, Name: 'New Student', Email: 'new@example.com', Role: 'Member', Status: 'Inactive', LastLogin: null },
    { UserID: 5, Name: 'Admin User', Email: 'admin@example.com', Role: 'Admin', Status: 'Active', LastLogin: new Date() },
];

export default function AdminUserManagement() {
    const [users, setUsers] = useState<MockUser[]>(mockUsersData); // Use mock data

    // Fetch users data from API/DB on component mount (example structure)
    // useEffect(() => {
    //     async function fetchUsers() {
    //         // Replace with your actual API call
    //         // const response = await fetch('/api/users');
    //         // const data = await response.json();
    //         // setUsers(data.map(user => ({ ...user, LastLogin: user.LastLogin ? new Date(user.LastLogin) : null }))); // Ensure dates are Date objects
    //     }
    //     fetchUsers();
    // }, []);

    const handleRoleChange = async (userId: number, newRole: 'Admin' | 'Officer' | 'Member') => {
        console.log(`Changing role for user ${userId} to ${newRole}`);
        // Demo: Update local state
        setUsers(currentUsers => currentUsers.map(user =>
            user.UserID === userId ? { ...user, Role: newRole } : user
        ));

        // TODO: Call actual API to update role
        // try {
        //     const response = await fetch(`/api/users/${userId}/role`, {
        //         method: 'PUT',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({ role: newRole }),
        //     });
        //     if (!response.ok) throw new Error('Failed to update role');
        //     // Optionally refetch or confirm update
        // } catch (error) {
        //     console.error("Error updating role:", error);
        // }
    };

    const handleStatusChange = async (userId: number) => {
        const userToUpdate = users.find(u => u.UserID === userId);
        if (!userToUpdate) return;
        const newStatus = userToUpdate.Status === 'Active' ? 'Inactive' : 'Active';

        console.log(`Changing status for user ${userId} to ${newStatus}`);
        // Demo: Update local state
        setUsers(currentUsers => currentUsers.map(user =>
            user.UserID === userId ? { ...user, Status: newStatus } : user
        ));

        // TODO: Call actual API to update status
        // try {
        //     const response = await fetch(`/api/users/${userId}/status`, {
        //         method: 'PUT',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({ status: newStatus }),
        //     });
        //     if (!response.ok) throw new Error('Failed to update status');
        //     // Optionally refetch or confirm update
        // } catch (error) {
        //     console.error("Error updating status:", error);
        // }
    };

    const getStatusBadgeVariant = (status: 'Active' | 'Inactive'): "default" | "outline" => {
        return status === 'Active' ? 'default' : 'outline';
    };

    const getRoleBadgeVariant = (role: 'Admin' | 'Officer' | 'Member'): "destructive" | "secondary" | "outline" => {
        switch (role) {
            case 'Admin': return 'destructive';
            case 'Officer': return 'secondary';
            default: return 'outline';
        }
    };

    return (
        <div className="space-y-6">
            {/* Search and Filter */}
            <Card>
                 <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Filter & Search Users</CardTitle>
                     <CardDescription>Find specific users and manage their roles.</CardDescription>
                 </CardHeader>
                <CardContent className="pt-4 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                         <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                         <Input placeholder="Search by name or email..." className="pl-8" />
                         {/* TODO: Add onChange handler and filter logic */}
                    </div>
                    <Select>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Officer">Officer</SelectItem>
                            <SelectItem value="Member">Member</SelectItem>
                        </SelectContent>
                         {/* TODO: Add onValueChange handler */}
                    </Select>
                     <Select>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                             <SelectItem value="all">All Status</SelectItem>
                             <SelectItem value="Active">Active</SelectItem>
                             <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                         {/* TODO: Add onValueChange handler */}
                    </Select>
                     <Button variant="outline">
                         <Filter className="mr-2 h-4 w-4"/> Apply Filters
                         {/* TODO: Add onClick handler */}
                     </Button>
                </CardContent>
            </Card>

            {/* User Table */}
            <Card>
                 <CardHeader>
                    <CardTitle>User Access Control</CardTitle>
                    <CardDescription>View and manage user roles and account statuses.</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Last Login</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.UserID}>
                                    <TableCell className="font-medium">{user.Name || 'N/A'}</TableCell>
                                    <TableCell>{user.Email}</TableCell>
                                    <TableCell>
                                         <Select value={user.Role} onValueChange={(newRole) => handleRoleChange(user.UserID, newRole as 'Admin' | 'Officer' | 'Member')}>
                                             <SelectTrigger className="h-8 w-[100px] text-xs">
                                                 <SelectValue placeholder="Select role" />
                                             </SelectTrigger>
                                             <SelectContent>
                                                 <SelectItem value="Admin">Admin</SelectItem>
                                                 <SelectItem value="Officer">Officer</SelectItem>
                                                 <SelectItem value="Member">Member</SelectItem>
                                             </SelectContent>
                                         </Select>
                                    </TableCell>
                                     <TableCell>
                                         <Badge variant={getStatusBadgeVariant(user.Status)} className={user.Status === 'Active' ? 'bg-green-600' : ''}>
                                             {user.Status}
                                         </Badge>
                                     </TableCell>
                                     <TableCell className="text-xs text-muted-foreground">
                                         {user.LastLogin ? format(user.LastLogin, 'PPp') : 'Never'}
                                     </TableCell>
                                    <TableCell className="text-right space-x-1">
                                         <Button variant="ghost" size="icon" className={`h-7 w-7 ${user.Status === 'Active' ? 'text-destructive' : 'text-green-600'}`} onClick={() => handleStatusChange(user.UserID)} title={user.Status === 'Active' ? 'Deactivate' : 'Activate'}>
                                             {user.Status === 'Active' ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                                             <span className="sr-only">{user.Status === 'Active' ? 'Deactivate' : 'Activate'}</span>
                                         </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                             {users.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                                        No users found.
                                    </TableCell>
                                </TableRow>
                             )}
                        </TableBody>
                    </Table>
                     <p className="text-xs text-muted-foreground mt-4">* This interface uses mock data. Database integration and API calls are required for full functionality.</p>
                </CardContent>
            </Card>
        </div>
    );
}
