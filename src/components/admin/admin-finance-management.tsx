'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"; // Import Badge component
import { DollarSign, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label"; // Ensure Label is imported

// Mock Data for Payments
const mockPayments = [
    { id: 'pay1', transactionId: 'GCASH_123', studentId: 'UA202301963', name: 'Princess K.', amount: 35, date: new Date(Date.now() - 86400000 * 2), status: 'Paid', memberships: 'CES, GHZ Builders' },
    { id: 'pay2', transactionId: 'GCASH_MOCK_174...', studentId: 'UA202401111', name: 'Juan D.', amount: 40, date: new Date(Date.now() - 86400000), status: 'Pending', memberships: 'CES, ICSO' }, // Example Pending
    { id: 'pay3', transactionId: 'GCASH_456', studentId: 'UA202301234', name: 'Maria C.', amount: 15, date: new Date(Date.now() - 86400000 * 5), status: 'Paid', memberships: 'AI Mentors' },
    { id: 'pay4', transactionId: null, studentId: 'UA202402222', name: 'Pedro S.', amount: 20, date: new Date(), status: 'Failed', memberships: 'CES' }, // Example Failed
];

export default function AdminFinanceManagement() {
    // TODO: Add state management for filtering and data fetching

    return (
        <div className="space-y-6">
            {/* Filters and Actions */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Filter Payments</CardTitle>
                    <CardDescription>View payments based on status or date range.</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 flex flex-col sm:flex-row gap-4 items-end">
                    <div className="grid gap-2 flex-1">
                        <Label htmlFor="payment-status-filter">Status</Label>
                        <Select>
                            <SelectTrigger id="payment-status-filter">
                                <SelectValue placeholder="Filter by Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="date-from">Date From</Label>
                        <Input id="date-from" type="date" />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="date-to">Date To</Label>
                        <Input id="date-to" type="date" />
                    </div>
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" /> Apply Filters
                    </Button>
                     <Button variant="secondary">
                         <Download className="mr-2 h-4 w-4" /> Export Report
                     </Button>
                </CardContent>
            </Card>

            {/* Payment Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Payment Records</CardTitle>
                    <CardDescription>List of membership payments received.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Transaction ID</TableHead>
                                <TableHead>Student ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Memberships</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockPayments.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell className="font-mono text-xs">{payment.transactionId || 'N/A'}</TableCell>
                                    <TableCell>{payment.studentId}</TableCell>
                                    <TableCell>{payment.name}</TableCell>
                                    <TableCell>₱{payment.amount.toFixed(2)}</TableCell>
                                    <TableCell>{payment.date.toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={payment.status === 'Paid' ? 'default' : payment.status === 'Failed' ? 'destructive' : 'secondary'}
                                               className={payment.status === 'Paid' ? 'bg-green-600' : ''}>
                                            {payment.status}
                                        </Badge>
                                    </TableCell>
                                     <TableCell className="text-xs">{payment.memberships}</TableCell>
                                </TableRow>
                            ))}
                            {mockPayments.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                                        No payment records found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <p className="text-xs text-muted-foreground mt-4">* Financial data is mock data. Integration with a real payment system backend is required.</p>
                </CardContent>
            </Card>
        </div>
    );
}
