'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge"; // Import Badge component
import { Check, X, Search, Eye, DollarSign, Mail, Filter } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useState, useEffect } from "react"; // Added useEffect
import { format } from 'date-fns'; // Import format
// Assuming Prisma schema with types User, Payment, PaymentStatus
// import type { User, Payment, PaymentStatus } from '@prisma/client';

// Mock data structure similar to potential joined data
interface MockApplication {
  id: string; // Could be PaymentID or a generated ID
  studentId: string | null;
  name: string | null;
  email: string | null;
  memberships: string[]; // Array of membership names
  amount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  applicationStatus: 'Approved' | 'Pending' | 'Rejected';
  paymentId: string | null; // Transaction ID from Payment table
  dateApplied: Date; // Use Date objects
  userId?: number | null; // Link to User table if available
}

const mockApplicationsData: MockApplication[] = [
    { id: 'app1', studentId: 'UA202301963', name: 'Princess K.', email: 'jame@example.com', memberships: ['CES', 'GHZ Builders'], amount: 35, paymentStatus: 'Paid', applicationStatus: 'Approved', paymentId: 'GCASH_123', dateApplied: new Date(Date.now() - 86400000 * 2), userId: 1 }, // 2 days ago
    { id: 'app2', studentId: 'UA202401111', name: 'Juan D.', email: 'juan@example.com', memberships: ['CES', 'ICSO'], amount: 40, paymentStatus: 'Pending', applicationStatus: 'Pending', paymentId: null, dateApplied: new Date(Date.now() - 86400000), userId: 2 }, // 1 day ago
    { id: 'app3', studentId: 'UA202301234', name: 'Maria C.', email: 'maria@example.com', memberships: ['AI Mentors'], amount: 15, paymentStatus: 'Paid', applicationStatus: 'Approved', paymentId: 'GCASH_456', dateApplied: new Date(Date.now() - 86400000 * 5), userId: 3 }, // 5 days ago
    { id: 'app4', studentId: 'UA202402222', name: 'Pedro S.', email: 'pedro@example.com', memberships: ['CES'], amount: 20, paymentStatus: 'Failed', applicationStatus: 'Pending', paymentId: null, dateApplied: new Date(), userId: 4 }, // Today
];

export default function AdminMembershipManagement() {
    const [applications, setApplications] = useState<MockApplication[]>(mockApplicationsData); // Use mock data
    const [selectedApplication, setSelectedApplication] = useState<MockApplication | null>(null);
    const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);

    // Fetch applications data from API/DB on component mount (example structure)
    // useEffect(() => {
    //     async function fetchApplications() {
    //         // Replace with your actual API call (e.g., fetching Payments and related User data)
    //         // const response = await fetch('/api/memberships/applications');
    //         // const data = await response.json();
    //         // Map data to MockApplication structure, ensuring dates are Date objects
    //         // setApplications(data.map(app => ({ ...app, dateApplied: new Date(app.dateApplied) })));
    //     }
    //     fetchApplications();
    // }, []);


    const handleApprove = async (id: string, userId?: number | null) => {
        console.log("Approving application:", id, "for user:", userId);
        // Demo: Update local state
        setApplications(apps => apps.map(app => app.id === id ? { ...app, applicationStatus: 'Approved' } : app));

        // TODO: Call actual API to update application status AND user role if applicable
        // try {
        //     const response = await fetch(`/api/memberships/applications/${id}/approve`, { method: 'POST' });
        //     if (!response.ok) throw new Error('Failed to approve application');
        //     // Optionally update User role if userId is available
        //     // if (userId) {
        //     //    await fetch(`/api/users/${userId}/role`, { method: 'PUT', body: JSON.stringify({ role: 'Member' /* or Officer */ }) });
        //     // }
        //     // Refetch or update state based on API response
        // } catch (error) {
        //     console.error("Error approving application:", error);
        // }
    };

    const handleReject = async (id: string) => {
        console.log("Rejecting application:", id);
        // TODO: Add confirmation and reason input
        // Demo: Update local state
        setApplications(apps => apps.map(app => app.id === id ? { ...app, applicationStatus: 'Rejected' } : app));

        // TODO: Call actual API to update status + send notification/email
        // try {
        //     const response = await fetch(`/api/memberships/applications/${id}/reject`, { method: 'POST' }); // Add reason in body
        //     if (!response.ok) throw new Error('Failed to reject application');
        //     // Refetch or update state
        // } catch (error) {
        //     console.error("Error rejecting application:", error);
        // }
    };

    const handleVerifyPayment = async (id: string) => {
        console.log("Verifying payment for application:", id);
        // TODO: Implement logic to check payment status (real API call to payment gateway or DB)
        // Demo: Toggle between Paid/Pending
        setApplications(apps => apps.map(app => {
            if (app.id === id) {
                const newStatus = app.paymentStatus === 'Paid' ? 'Pending' : 'Paid';
                return { ...app, paymentStatus: newStatus, paymentId: newStatus === 'Paid' ? `GCASH_MOCK_${Date.now()}` : null };
            }
            return app;
        }));

         // TODO: Call actual API to update payment status in DB
        // try {
        //      // Example: Fetch payment status from GCash query API or webhook data stored in DB
        //      // const paymentVerificationStatus = await fetch(`/api/payments/${id}/verify`);
        //      // const verificationData = await paymentVerificationStatus.json();
        //      // if (verificationData.status === 'Paid') {
        //      //    setApplications(apps => apps.map(app => app.id === id ? { ...app, paymentStatus: 'Paid', paymentId: verificationData.transactionId } : app));
        //      //    // Update DB payment record
        //      // } else { // Handle other statuses (Pending, Failed) }
        // } catch (error) {
        //     console.error("Error verifying payment:", error);
        // }
    };

    const handleViewDetails = (app: MockApplication) => {
        setSelectedApplication(app);
        setIsDetailViewOpen(true);
    };

    const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
            case 'Paid':
            case 'Approved':
                return 'default';
            case 'Pending':
                return 'secondary';
            case 'Failed':
            case 'Rejected':
                return 'destructive';
            default:
                return 'outline';
        }
    };

     const getStatusBadgeColor = (status: string): string => {
         switch (status) {
             case 'Paid':
             case 'Approved':
                 return 'bg-green-600';
             case 'Rejected':
                 return 'bg-red-600';
             default:
                 return '';
         }
     };


    return (
        <div className="space-y-6">
             {/* Search and Filter */}
             <Card>
                 <CardHeader className="pb-2">
                     <CardTitle className="text-lg">Filter & Search</CardTitle>
                     <CardDescription>Find specific applications.</CardDescription>
                 </CardHeader>
                <CardContent className="pt-4 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                         <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                         <Input placeholder="Search by Student ID, Name, or Email..." className="pl-8" />
                         {/* TODO: Add onChange handler and filter logic */}
                    </div>
                    {/* TODO: Add filters for Status, Membership Type */}
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4"/> Filter
                    </Button>
                </CardContent>
             </Card>

            {/* Application Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Membership Application Review</CardTitle>
                    <CardDescription>Review pending applications, manage statuses, and verify payments.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Memberships</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead>Application</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applications.map((app) => (
                                <TableRow key={app.id}>
                                    <TableCell className="font-medium">{app.studentId || 'N/A'}</TableCell>
                                    <TableCell>{app.name || 'N/A'}</TableCell>
                                    <TableCell className="text-xs">{app.memberships.join(', ')}</TableCell>
                                    <TableCell>₱{app.amount.toFixed(2)}</TableCell>
                                    <TableCell>
                                         <Badge variant={getStatusBadgeVariant(app.paymentStatus)} className={getStatusBadgeColor(app.paymentStatus)}>
                                            {app.paymentStatus}
                                         </Badge>
                                    </TableCell>
                                    <TableCell>
                                         <Badge variant={getStatusBadgeVariant(app.applicationStatus)} className={getStatusBadgeColor(app.applicationStatus)}>
                                            {app.applicationStatus}
                                         </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-1">
                                         {app.applicationStatus === 'Pending' && app.paymentStatus === 'Paid' && ( // Only allow approve/reject if payment is confirmed
                                            <>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-green-600" onClick={() => handleApprove(app.id, app.userId)} title="Approve Application">
                                                    <Check className="h-4 w-4" />
                                                    <span className="sr-only">Approve</span>
                                                </Button>
                                                 <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleReject(app.id)} title="Reject Application">
                                                     <X className="h-4 w-4" />
                                                     <span className="sr-only">Reject</span>
                                                 </Button>
                                            </>
                                         )}
                                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleVerifyPayment(app.id)} title="Verify Payment">
                                              <DollarSign className="h-4 w-4" />
                                              <span className="sr-only">Verify Payment</span>
                                          </Button>
                                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleViewDetails(app)} title="View Details">
                                              <Eye className="h-4 w-4" />
                                              <span className="sr-only">View Details</span>
                                          </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                             {applications.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                                        No membership applications found.
                                    </TableCell>
                                </TableRow>
                             )}
                        </TableBody>
                    </Table>
                     <p className="text-xs text-muted-foreground mt-4">* This interface uses mock data. Database integration and API calls are required for full functionality.</p>
                </CardContent>
            </Card>

            {/* Application Details Dialog */}
            <Dialog open={isDetailViewOpen} onOpenChange={setIsDetailViewOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Application Details</DialogTitle>
                        <DialogDescription>Viewing application for {selectedApplication?.studentId || 'N/A'}</DialogDescription>
                    </DialogHeader>
                    {selectedApplication && (
                        <div className="py-4 space-y-3 text-sm">
                            <p><strong>Student Name:</strong> {selectedApplication.name || 'N/A'}</p>
                            <p><strong>Student ID:</strong> {selectedApplication.studentId || 'N/A'}</p>
                            <p><strong>Email:</strong> {selectedApplication.email || 'N/A'}</p>
                            <p><strong>Date Applied:</strong> {format(selectedApplication.dateApplied, 'PPP')}</p>
                            <p><strong>Memberships:</strong> {selectedApplication.memberships.join(', ')}</p>
                            <p><strong>Amount Due:</strong> ₱{selectedApplication.amount.toFixed(2)}</p>
                            <p><strong>Payment Status:</strong> <Badge variant={getStatusBadgeVariant(selectedApplication.paymentStatus)} className={getStatusBadgeColor(selectedApplication.paymentStatus)}>{selectedApplication.paymentStatus}</Badge></p>
                            <p><strong>Payment ID (Transaction):</strong> {selectedApplication.paymentId || 'N/A'}</p>
                            <p><strong>Application Status:</strong> <Badge variant={getStatusBadgeVariant(selectedApplication.applicationStatus)} className={getStatusBadgeColor(selectedApplication.applicationStatus)}>{selectedApplication.applicationStatus}</Badge></p>
                        </div>
                    )}
                    <DialogFooter>
                         <Button type="button" variant="secondary" onClick={() => setIsDetailViewOpen(false)}>Close</Button>
                         {/* Add manual action buttons if needed, e.g., manually mark as paid */}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
