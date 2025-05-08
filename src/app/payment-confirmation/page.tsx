'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle, XCircle, Download, Home, Phone } from 'lucide-react'; // Added Phone
import { useEffect, useState, Suspense } from 'react';
import { format } from 'date-fns'; // Ensure date-fns is imported

// Mapping for sub-org slugs to display names
const subOrgDisplayNames: { [key: string]: string } = {
  'ai-mentors': 'AI Mentors',
  'algorithm-knights': 'Algorithm Knights',
  'code-warriors': 'Code Warriors',
  'cybernet-rangers': 'Cybernet Rangers',
  'digital-expressionists': 'Digital Expressionists',
  'ghz-builders': 'GHZ Builders',
  'mobile-mnemonics': 'Mobile Mnemonics',
  'web-arachnids': 'Web Arachnids',
};


function PaymentConfirmationContent() {
    const searchParams = useSearchParams();
    const status = searchParams.get('status');
    const amount = searchParams.get('amount');
    const email = searchParams.get('email');
    const phoneNumber = searchParams.get('phoneNumber'); // Get phone number
    const section = searchParams.get('section'); // Get section
    const studentId = searchParams.get('studentId'); // Get student ID
    const transactionId = searchParams.get('transactionId'); // Get transaction ID from redirect
    const cesMembership = searchParams.get('ces') === 'true';
    const icsoMembership = searchParams.get('icso') === 'true';
    const subOrgSlug = searchParams.get('subOrg');

    const [transactionDate, setTransactionDate] = useState('');

    useEffect(() => {
      // Set transaction date only on client-side to avoid hydration errors
       setTransactionDate(format(new Date(), 'P p')); // Format date and time nicely

      // Store notification data in local storage (client-side only)
      if (status === 'success') {
          const newNotification = {
              id: transactionId || `payment_${Date.now()}`, // Use transactionId or generate fallback
              type: 'payment_success',
              title: 'Membership Payment Successful',
              message: `Paid ₱${amount} for memberships.`,
              date: new Date().toISOString(),
              isNew: true, // Mark as new
              details: {
                  amount,
                  email,
                  phoneNumber, // Include phone number
                  section,
                  studentId,
                  ces: cesMembership,
                  icso: icsoMembership,
                  subOrg: subOrgSlug ? subOrgDisplayNames[subOrgSlug] : null,
                  transactionId,
              }
          };

          // Get existing notifications or initialize an empty array
          const existingNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
          // Add the new notification and keep only the latest (or a limited number)
          const updatedNotifications = [newNotification, ...existingNotifications].slice(0, 10); // Keep latest 10
          localStorage.setItem('notifications', JSON.stringify(updatedNotifications));

          // Dispatch a custom event to notify other components (like the sidebar) immediately
           window.dispatchEvent(new CustomEvent('notificationsUpdated'));
      }

    }, [status, amount, email, phoneNumber, section, studentId, transactionId, cesMembership, icsoMembership, subOrgSlug]); // Add dependencies


    const isSuccess = status === 'success';
    const selectedSubOrgName = subOrgSlug ? subOrgDisplayNames[subOrgSlug] : null;

    const generateMembershipList = (forReceipt = false) => {
      const items = [];
      if (cesMembership) items.push(forReceipt ? "- CES Membership" : <li key="ces">CES Membership</li>);
      if (icsoMembership) items.push(forReceipt ? "- ICSO Membership" : <li key="icso">ICSO Membership</li>);
      if (selectedSubOrgName) items.push(forReceipt ? `- Sub-Org: ${selectedSubOrgName}` : <li key="suborg">Sub-Organization: {selectedSubOrgName}</li>);

      if (items.length === 0 && forReceipt) {
        items.push("- No specific memberships recorded for this transaction.");
      } else if (items.length === 0 && !forReceipt) {
        items.push(<li key="none" className="text-muted-foreground">No specific memberships recorded.</li>);
      }

      return items;
    };


    const handleDownloadReceipt = () => {
      const receiptMemberships = generateMembershipList(true).join('\n      ');
      // Basic text receipt generation and download
      const receiptContent = `
----------------------------------------
      ICCT CES - Membership Receipt
----------------------------------------
Status: ${isSuccess ? 'Payment Successful' : 'Payment Failed'}
Date: ${transactionDate || 'Loading...'}
Transaction ID: ${transactionId || 'N/A'}

Student Details:
      Email: ${email || 'N/A'}
      Phone: ${phoneNumber || 'N/A'}
      Student ID: ${studentId || 'N/A'}
      Section: ${section || 'N/A'}

Payment Details:
      Amount Paid: ₱${amount || '0.00'}

Memberships:
      ${receiptMemberships}

Thank you for supporting ICCT CES Chapter - Antipolo!
----------------------------------------
      `.trim(); // Use trim() to remove leading/trailing whitespace

      const blob = new Blob([receiptContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ICCT_CES_Receipt_${transactionId || new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    return (
      <Card className={`w-full max-w-lg shadow-xl text-center animate-scaleUp ${isSuccess ? 'border-green-500' : 'border-destructive'}`}>
        <CardHeader className="items-center">
          {isSuccess ? (
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          ) : (
            <XCircle className="h-16 w-16 text-destructive mb-4" />
          )}
          <CardTitle className={`text-3xl font-bold ${isSuccess ? 'text-green-600' : 'text-destructive'}`}>
            {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
          </CardTitle>
          <CardDescription className="text-lg">
            {isSuccess
              ? 'Your membership payment has been processed.'
              : 'There was an issue processing your payment. Please try again or contact support.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isSuccess && (
            <div className="text-left bg-muted p-4 rounded-md space-y-2 border">
              <h3 className="font-semibold text-lg mb-2 border-b pb-1">Receipt Details</h3>
              <p><strong>Transaction Date:</strong> {transactionDate || 'Loading...'}</p>
              <p><strong>Transaction ID:</strong> {transactionId || 'N/A'}</p>
              <p><strong>Email:</strong> {email || 'Not provided'}</p>
              <p><strong>Phone Number:</strong> {phoneNumber || 'Not provided'}</p>
              <p><strong>Student ID:</strong> {studentId || 'Not provided'}</p>
              <p><strong>Section:</strong> {section || 'Not provided'}</p>
              <p><strong>Amount Paid:</strong> <span className="font-bold text-primary">₱{amount || '0.00'}</span></p>
              <div>
                <strong>Memberships Paid For:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 text-sm">
                  {generateMembershipList()}
                </ul>
              </div>
              <p className="text-sm text-muted-foreground pt-2">A confirmation has also been sent to your email (if provided).</p>
            </div>
          )}

           <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
               {isSuccess && (
                  <Button onClick={handleDownloadReceipt} className="w-full sm:flex-1 btn-hover-scale">
                    <Download className="mr-2 h-4 w-4" /> Download Receipt
                  </Button>
               )}
               <Link href="/" passHref className="w-full sm:flex-1">
                 <Button variant="outline" className="w-full btn-hover-shadow">
                   <Home className="mr-2 h-4 w-4" /> Back to Home
                 </Button>
               </Link>
           </div>


          {!isSuccess && (
             <Link href="/membership" passHref>
                <Button variant="destructive" className="w-full btn-hover-scale">
                   Try Payment Again
                 </Button>
             </Link>
          )}
        </CardContent>
      </Card>
    );
}


export default function PaymentConfirmationPage() {
    // Wrap content in Suspense to handle useSearchParams()
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <Suspense fallback={<div>Loading payment details...</div>}>
          <PaymentConfirmationContent />
        </Suspense>
      </div>
    );
}
