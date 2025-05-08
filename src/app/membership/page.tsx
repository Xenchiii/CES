'use client';

import * as React from 'react';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { initiateGcashPayment, GcashPaymentInitiationRequest } from '@/services/gcash'; // Updated import
import { useToast } from "@/hooks/use-toast";
import { Users, University, BrainCircuit, Sparkles, Code, ShieldCheck, Palette, Cpu, Smartphone, Globe, CreditCard, Mail, BookUser, Hash, Phone } from 'lucide-react'; // Added Phone icon
import { useRouter } from 'next/navigation'; // Keep router

// Philippine phone number regex (starts with 09 or +639, followed by 9 digits)
const phoneRegex = /^(09|\+639)\d{9}$/;

const subOrgs = [
  { id: 'ai-mentors', name: 'AI Mentors', icon: BrainCircuit },
  { id: 'algorithm-knights', name: 'Algorithm Knights', icon: Sparkles },
  { id: 'code-warriors', name: 'Code Warriors', icon: Code },
  { id: 'cybernet-rangers', name: 'Cybernet Rangers', icon: ShieldCheck },
  { id: 'digital-expressionists', name: 'Digital Expressionists', icon: Palette },
  { id: 'ghz-builders', name: 'GHZ Builders', icon: Cpu },
  { id: 'mobile-mnemonics', name: 'Mobile Mnemonics', icon: Smartphone },
  { id: 'web-arachnids', name: 'Web Arachnids', icon: Globe },
];


const membershipSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  phoneNumber: z.string().regex(phoneRegex, { message: "Please enter a valid PH phone number (e.g., 09xxxxxxxxx or +639xxxxxxxxx)." }),
  section: z.string().min(1, { message: "Please enter your section." }).regex(/^[A-Z0-9]+$/, { message: "Section format invalid (e.g., LFAU322A002)."}), // Basic format validation
  studentId: z.string().regex(/^UA\d{9}$/, { message: "Student ID must be in UA<YEAR><NUMBER> format (e.g., UA202301963)." }),
  cesMembership: z.boolean().default(false),
  icsoMembership: z.boolean().default(false),
  subOrgMembership: z.boolean().default(false),
  selectedSubOrg: z.string().optional(),
}).refine(data => data.cesMembership || data.icsoMembership || data.subOrgMembership, {
  message: "Please select at least one membership.",
  path: ["cesMembership"], // Attach error to the first checkbox for layout
}).refine(data => data.subOrgMembership ? data.selectedSubOrg && data.selectedSubOrg !== "none" : true, {
  message: "Please select a sub-organization if joining one.",
  path: ["selectedSubOrg"],
});

type MembershipFormValues = z.infer<typeof membershipSchema>;

const membershipCosts = {
  ces: 20,
  icso: 20,
  subOrg: 15,
};

export default function MembershipPage() {
  const { toast } = useToast();
  const router = useRouter(); // Keep router
  const [totalAmount, setTotalAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<MembershipFormValues>({
    resolver: zodResolver(membershipSchema),
    defaultValues: {
      email: '',
      phoneNumber: '',
      section: '',
      studentId: '',
      cesMembership: false,
      icsoMembership: false,
      subOrgMembership: false,
      selectedSubOrg: 'none',
    },
  });

  const watchFields = form.watch(['cesMembership', 'icsoMembership', 'subOrgMembership']);

  React.useEffect(() => {
    let currentTotal = 0;
    if (watchFields[0]) currentTotal += membershipCosts.ces;
    if (watchFields[1]) currentTotal += membershipCosts.icso;
    if (watchFields[2]) currentTotal += membershipCosts.subOrg;
    setTotalAmount(currentTotal);
  }, [watchFields[0], watchFields[1], watchFields[2]]);


  async function onSubmit(data: MembershipFormValues) {
    if (totalAmount <= 0) {
      toast({
        variant: "destructive",
        title: "No Membership Selected",
        description: "Please select at least one membership to proceed.",
      });
      return;
    }

    setIsProcessing(true);
    try {
       const paymentMetadata = {
            email: data.email,
            phoneNumber: data.phoneNumber, // Include phone number
            section: data.section,
            studentId: data.studentId,
            ces: data.cesMembership,
            icso: data.icsoMembership,
            subOrg: data.subOrgMembership ? data.selectedSubOrg : null,
            timestamp: new Date().toISOString(),
       };

      const paymentDetails: GcashPaymentInitiationRequest = {
        amount: totalAmount,
        metadata: paymentMetadata,
        description: "ICCT CES Membership Payment",
      };

      // Call the service to get the GCash redirection URL
      const response = await initiateGcashPayment(paymentDetails);

      toast({
        title: "Processing Payment...",
        description: "Redirecting to GCash...",
      });

      // --- Redirect the user to the actual GCash payment URL ---
      // The response.paymentUrl is now the simulated GCash cashier URL OR
      // the final confirmation URL if skipping the mock cashier page.
      // Use window.location.href for redirection.
      console.log("Redirecting to payment URL:", response.paymentUrl);
      window.location.href = response.paymentUrl;
      // --- End Redirection ---

      // Note: The user leaves this page. No need to reset form or set isProcessing=false here.
      // The user will land on the GCash page, then eventually be redirected back
      // to the `/payment-confirmation` page based on the `paymentReturnUrl` flow.

    } catch (error) {
      console.error("Payment initiation failed:", error);
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: (error as Error).message || "Could not initiate payment. Please try again later.",
      });
      setIsProcessing(false); // Only set to false on error
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-10">
      <h1 className="text-4xl font-bold text-center flex items-center justify-center gap-3 animate-fadeIn">
        <Users className="text-accent h-9 w-9" /> Become a Member
      </h1>
       <p className="text-center text-lg text-muted-foreground max-w-3xl mx-auto animate-fadeIn animation-delay-100">
        Join the ICCT Computer Explorer Society and its affiliated organizations. Select your desired memberships below.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Membership Catalog */}
        <div className="space-y-6 animate-slideInFromLeft">
          <h2 className="text-2xl font-semibold">Available Memberships</h2>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><University className="h-5 w-5 text-primary" />Computer Explorer Society (CES)</CardTitle>
              <CardDescription>Main student organization for computer studies.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-lg text-primary">₱{membershipCosts.ces}.00</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><University className="h-5 w-5 text-primary" />ICSO</CardTitle>
              <CardDescription>Inter-Campus Student Organization.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-lg text-primary">₱{membershipCosts.icso}.00</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><University className="h-5 w-5 text-primary" />Sub-Organization</CardTitle>
              <CardDescription>Join a specialized group (choose one below).</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-lg text-primary">₱{membershipCosts.subOrg}.00</p>
              <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                 {subOrgs.map(org => <li key={org.id} className="flex items-center gap-1.5"><org.icon className="h-4 w-4 flex-shrink-0"/> {org.name}</li>)}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Membership Form */}
        <div className="animate-slideInFromRight">
           <Card className="shadow-lg">
             <CardHeader>
                <CardTitle className="text-2xl">Gcash Payment</CardTitle>
                <CardDescription>Select memberships and provide your details for payment.</CardDescription>
             </CardHeader>
             <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                   <FormField
                     control={form.control}
                     name="email"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel className="flex items-center gap-1.5"><Mail className="h-4 w-4"/> Email Address</FormLabel>
                         <FormControl>
                           <Input placeholder="your.email@example.com" {...field} />
                         </FormControl>
                         <FormDescription>
                           We'll send payment confirmation here.
                         </FormDescription>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                    <FormField
                     control={form.control}
                     name="phoneNumber"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel className="flex items-center gap-1.5"><Phone className="h-4 w-4"/> Phone Number</FormLabel>
                         <FormControl>
                           <Input type="tel" placeholder="09xxxxxxxxx or +639xxxxxxxxx" {...field} />
                         </FormControl>
                         <FormDescription>
                           Your GCash-linked phone number (used for payment).
                         </FormDescription>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                   <FormField
                     control={form.control}
                     name="section"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel className="flex items-center gap-1.5"><BookUser className="h-4 w-4"/> Section</FormLabel>
                         <FormControl>
                             <Input placeholder="Example: LFAU322A002" {...field} />
                         </FormControl>
                         <FormDescription>
                           Example: LFAU322A002
                         </FormDescription>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                   <FormField
                     control={form.control}
                     name="studentId"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel className="flex items-center gap-1.5"><Hash className="h-4 w-4"/> Student No.</FormLabel>
                         <FormControl>
                             <Input placeholder="Example: UA202301963" {...field} />
                         </FormControl>
                         <FormDescription>
                           Format: UA&lt;YEAR&gt;&lt;NUMBER&gt; (e.g., UA202301963)
                         </FormDescription>
                         <FormMessage />
                       </FormItem>
                     )}
                   />

                  <div className="space-y-3">
                     <FormLabel>Select Memberships</FormLabel>
                     <FormField
                       control={form.control}
                       name="cesMembership"
                       render={({ field }) => (
                         <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 hover:bg-accent/5 transition-colors">
                           <FormControl>
                             <Checkbox
                               checked={field.value}
                               onCheckedChange={field.onChange}
                             />
                           </FormControl>
                           <FormLabel className="font-normal flex-grow cursor-pointer">
                             Join Computer Explorer Society (CES) - ₱{membershipCosts.ces}.00
                           </FormLabel>
                         </FormItem>
                       )}
                     />
                     <FormField
                       control={form.control}
                       name="icsoMembership"
                       render={({ field }) => (
                         <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 hover:bg-accent/5 transition-colors">
                           <FormControl>
                             <Checkbox
                               checked={field.value}
                               onCheckedChange={field.onChange}
                             />
                           </FormControl>
                           <FormLabel className="font-normal flex-grow cursor-pointer">
                             Join ICSO - ₱{membershipCosts.icso}.00
                           </FormLabel>
                         </FormItem>
                       )}
                     />
                     <FormField
                       control={form.control}
                       name="subOrgMembership"
                       render={({ field }) => (
                         <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 hover:bg-accent/5 transition-colors">
                           <FormControl>
                             <Checkbox
                               checked={field.value}
                               onCheckedChange={field.onChange}
                             />
                           </FormControl>
                           <FormLabel className="font-normal flex-grow cursor-pointer">
                             Join a Sub-Organization - ₱{membershipCosts.subOrg}.00
                           </FormLabel>
                         </FormItem>
                       )}
                     />
                      {/* Display combined form error message for membership selection */}
                      {form.formState.errors.cesMembership && !form.watch('cesMembership') && !form.watch('icsoMembership') && !form.watch('subOrgMembership') && (
                           <p className="text-sm font-medium text-destructive">
                               {form.formState.errors.cesMembership.message}
                           </p>
                      )}
                  </div>


                  {form.watch('subOrgMembership') && (
                    <FormField
                      control={form.control}
                      name="selectedSubOrg"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Sub-Organization</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value || 'none'}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose a sub-organization..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                 <SelectItem value="none" disabled>Choose a sub-organization...</SelectItem>
                                {subOrgs.map(org => (
                                  <SelectItem key={org.id} value={org.id}>
                                    <span className="flex items-center gap-2"><org.icon className="h-4 w-4"/> {org.name}</span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                           </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div className="text-right space-y-2">
                    <p className="text-lg font-semibold">Total Amount: <span className="text-primary">₱{totalAmount}.00</span></p>
                    <Button type="submit" disabled={isProcessing || totalAmount <= 0} className="w-full md:w-auto btn-hover-scale btn-hover-shadow">
                      <CreditCard className="mr-2 h-4 w-4" /> {isProcessing ? 'Processing...' : 'Proceed to GCash'}
                    </Button>
                  </div>
                     {/* Display root error if needed (though refined errors are attached to fields now) */}
                     {form.formState.errors.root && (
                       <p className="text-sm font-medium text-destructive">
                           {form.formState.errors.root.message}
                       </p>
                     )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Add animation delay utility if needed
// <style jsx>{` .animation-delay-100 { animation-delay: 0.1s; } `}</style>
