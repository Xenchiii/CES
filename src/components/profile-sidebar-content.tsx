
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'; // Added Dialog components
import { cn } from '@/lib/utils';
import { ArrowLeft, Cake, Edit, GraduationCap, Mail, School, ScanSearch, User, Image as ImageIcon, X, QrCode } from 'lucide-react'; // Added QrCode icon
import { useState, useEffect } from 'react';
import { SheetClose } from '@/components/ui/sheet'; 
import Image from 'next/image'; // Added Image for QR code

// Mock user data - replace with actual data fetching/context
const initialUserProfile = {
  name: 'Princess Khazanabelle Cartoja',
  year: '2nd Year',
  course: 'Bachelor Of Science In Information Technology',
  section: 'LFAU233A002',
  dob: '2004-10-13', // Use YYYY-MM-DD for date input
  profileImageUrl: 'https://picsum.photos/seed/profilepic/200/200', // Placeholder profile image
  profileImageHint: 'student portrait person face',
  email: 'JameLeague15@Gmail.com',
  studentId: 'UA202301963',
};

export default function ProfileSidebarContent() {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState(initialUserProfile);
    const [editedProfile, setEditedProfile] = useState(initialUserProfile);

    const [isAttendanceQrOpen, setIsAttendanceQrOpen] = useState(false);
    const [attendanceQrCodeUrl, setAttendanceQrCodeUrl] = useState<string | null>(null);


    useEffect(() => {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            try {
                const parsedProfile = JSON.parse(savedProfile);
                const mergedProfile = { ...initialUserProfile, ...parsedProfile };
                setProfileData(mergedProfile);
                setEditedProfile(mergedProfile);
            } catch (e) {
                console.error("Failed to parse profile from local storage", e);
                 setProfileData(initialUserProfile);
                 setEditedProfile(initialUserProfile);
            }
        } else {
             setProfileData(initialUserProfile);
             setEditedProfile(initialUserProfile);
        }
    }, []);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = () => {
        console.log('Saving profile:', editedProfile);
        setProfileData(editedProfile);
        localStorage.setItem('userProfile', JSON.stringify(editedProfile));
        setIsEditing(false);
        alert('Profile saved!');
    };

    const toggleEdit = () => {
      if (isEditing) {
        setEditedProfile(profileData);
      } else {
          setEditedProfile(profileData);
      }
      setIsEditing(!isEditing);
    };

    const formatDateForDisplay = (dateString: string) => {
        try {
            if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
                 return 'N/A';
            }
            const date = new Date(dateString + 'T00:00:00'); 
            if (isNaN(date.getTime())) {
                return 'Invalid Date';
            }
            return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
        } catch (e) {
            console.error("Error formatting date:", e);
            return dateString; 
        }
    };

    const handleGenerateAttendanceQr = () => {
      if (!profileData.studentId) {
        alert("Student ID is not available to generate QR code.");
        return;
      }
      const qrData = `ATTENDANCE_CES:${profileData.studentId}|NAME:${profileData.name}|COURSE:${profileData.course}|SECTION:${profileData.section}`;
      const encodedData = encodeURIComponent(qrData);
      setAttendanceQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?data=${encodedData}&size=250x250&ecc=M&margin=10`);
      setIsAttendanceQrOpen(true);
    };

  return (
    <div className="p-6 space-y-6 overflow-y-auto flex-1">
       <div className="flex flex-col items-center space-y-4 pt-8"> 
           <Avatar className="h-28 w-28 border-4 border-sidebar-accent shadow-lg">
               <AvatarImage src={profileData.profileImageUrl} alt={profileData.name} data-ai-hint={profileData.profileImageHint} />
               <AvatarFallback>{profileData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
           </Avatar>
            <div className="text-center">
               <h2 className="text-2xl font-semibold text-sidebar-foreground">{profileData.name}</h2>
                <p className="text-md text-sidebar-foreground/80">{profileData.course}</p>
            </div>
       </div>

        <div className="space-y-4">
            {!isEditing && (
                <>
                    <DetailItem icon={User} label="Name" value={profileData.name} />
                    <DetailItem icon={GraduationCap} label="Course" value={profileData.course} />
                    <DetailItem icon={School} label="Year & Section" value={`${profileData.year} - ${profileData.section}`} />
                    <DetailItem icon={ScanSearch} label="Student ID" value={profileData.studentId} />
                    <DetailItem icon={Mail} label="Email" value={profileData.email} />
                    <DetailItem icon={Cake} label="Date of Birth" value={formatDateForDisplay(profileData.dob)} />
                </>
            )}

            {isEditing && (
                <div className="space-y-4">
                    <EditItem name="name" label="Name" value={editedProfile.name} onChange={handleInputChange} icon={User} />
                    <EditItem name="course" label="Course" value={editedProfile.course} onChange={handleInputChange} icon={GraduationCap}/>
                    <div className="grid grid-cols-2 gap-4">
                         <EditItem name="year" label="Year" value={editedProfile.year} onChange={handleInputChange} icon={School}/>
                         <EditItem name="section" label="Section" value={editedProfile.section} onChange={handleInputChange} />
                    </div>
                    <EditItem name="studentId" label="Student ID" value={editedProfile.studentId} onChange={handleInputChange} icon={ScanSearch} />
                    <EditItem name="email" label="Email" type="email" value={editedProfile.email} onChange={handleInputChange} icon={Mail} />
                    <EditItem name="dob" label="Date of Birth" type="date" value={editedProfile.dob} onChange={handleInputChange} icon={Cake} />
                     <EditItem name="profileImageUrl" label="Profile Image URL" value={editedProfile.profileImageUrl} onChange={handleInputChange} icon={ImageIcon} />
                </div>
            )}
        </div>

        <div className="flex flex-col gap-3 pt-6">
             <Button variant="outline" onClick={toggleEdit} className="w-full">
                <Edit className="mr-2 h-4 w-4" /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
             </Button>
            {isEditing && (
                 <Button onClick={handleSaveChanges} className="w-full">
                     Save Changes
                 </Button>
            )}
            {!isEditing && (
                 <Button onClick={handleGenerateAttendanceQr} className="w-full">
                     <QrCode className="mr-2 h-4 w-4" /> Show Attendance QR
                 </Button>
            )}
        </div>

      <Dialog open={isAttendanceQrOpen} onOpenChange={setIsAttendanceQrOpen}>
        <DialogContent className="sm:max-w-md bg-background text-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" /> Attendance QR Code
            </DialogTitle>
            {/* The explicit DialogClose button was here and has been removed. 
                DialogContent itself provides a default close button. */}
          </DialogHeader>
          <div className="py-4 flex flex-col items-center">
            {attendanceQrCodeUrl ? (
              <Image src={attendanceQrCodeUrl} alt="Attendance QR Code" width={250} height={250} data-ai-hint="qr code attendance" />
            ) : (
              <p>Generating QR Code...</p>
            )}
            <p className="text-sm text-muted-foreground mt-3">Scan this QR code for attendance.</p>
            <p className="text-xs text-muted-foreground mt-1">Student ID: {profileData.studentId}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
     <div className="flex items-start gap-4 p-3 rounded-md hover:bg-sidebar-accent/10">
        <Icon className="h-5 w-5 text-sidebar-accent flex-shrink-0 mt-1" />
        <div>
           <p className="text-sm text-sidebar-foreground/70">{label}</p>
           <p className="text-md font-medium text-sidebar-foreground">{value || 'N/A'}</p>
        </div>
    </div>
);

const EditItem = ({ name, label, value, onChange, icon: Icon, type = 'text' }: { name: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, icon?: React.ElementType, type?: string }) => (
    <div className="space-y-1.5">
       <Label htmlFor={name} className="text-sm text-sidebar-foreground/70 flex items-center gap-1.5">
            {Icon && <Icon className="h-4 w-4" />}
            {label}
       </Label>
       <Input
            id={name}
            name={name}
            type={type}
            value={value || ''} 
            onChange={onChange}
            className="h-9 text-sm bg-sidebar-background/50 border-sidebar-border focus:bg-sidebar-background focus:ring-sidebar-ring"
       />
    </div>
);

