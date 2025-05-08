
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import { QrCode } from 'lucide-react';

const scoreCategories = ['Quiz', 'Recitation', 'Project'];
const attendanceLabel = 'Attendance';
const numberOfEntries = 5;

export default function IndexCardQrGenerator() {
  const [studentId, setStudentId] = useState(''); // Empty by default
  const [surname, setSurname] = useState('');
  const [firstname, setFirstname] = useState('');
  
  const [quizScores, setQuizScores] = useState<string[]>(Array(numberOfEntries).fill(''));
  const [recitationScores, setRecitationScores] = useState<string[]>(Array(numberOfEntries).fill(''));
  const [projectScores, setProjectScores] = useState<string[]>(Array(numberOfEntries).fill(''));
  const [attendance, setAttendance] = useState<boolean[]>(Array(numberOfEntries).fill(false));

  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const handleScoreChange = (category: string, index: number, value: string) => {
    const newScores = value.slice(0, 3); // Limit input to 3 characters (e.g., "100")
    if (category === 'Quiz') {
      setQuizScores(prev => prev.map((s, i) => (i === index ? newScores : s)));
    } else if (category === 'Recitation') {
      setRecitationScores(prev => prev.map((s, i) => (i === index ? newScores : s)));
    } else if (category === 'Project') {
      setProjectScores(prev => prev.map((s, i) => (i === index ? newScores : s)));
    }
  };

  const handleAttendanceChange = (index: number, checked: boolean) => {
    setAttendance(prev => prev.map((a, i) => (i === index ? checked : a)));
  };

  const generateQrDataString = () => {
    const dataParts = [
      `ID:${studentId || 'N/A'}`,
      `S:${surname.toUpperCase() || 'N/A'}`,
      `F:${firstname.toUpperCase() || 'N/A'}`,
      `Q:${quizScores.map(s => s || '0').join(',')}`, // Default to 0 if empty
      `R:${recitationScores.map(s => s || '0').join(',')}`,
      `P:${projectScores.map(s => s || '0').join(',')}`,
      `A:${attendance.map(a => (a ? '1' : '0')).join(',')}`,
    ];
    return dataParts.join(';');
  };

  const handleGenerateQrCode = () => {
    if (!studentId.trim() || !surname.trim() || !firstname.trim()) {
        alert("Please fill in Student ID, Surname, and Firstname.");
        setQrCodeUrl(null);
        return;
    }
    const data = generateQrDataString();
    const encodedData = encodeURIComponent(data);
    // Using qrserver.com API for QR code generation
    setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?data=${encodedData}&size=200x200&ecc=M`);
  };
  
  // Students fill this, so no pre-fill needed.
  // useEffect(() => {
  // }, []);


  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl animate-scaleUp">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
           IndexCardQR <span className="text-primary text-2xl">v1.0</span>
        </CardTitle>
         <CardDescription>Fill in your details and scores to generate a QR code for your index card.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="studentId">Student ID Number</Label>
          <Input id="studentId" value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="e.g., UA202301963" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="surname">Surname (apelyido)</Label>
          <Input id="surname" value={surname} onChange={(e) => setSurname(e.target.value.toUpperCase())} placeholder="e.g., DELA CRUZ" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="firstname">Firstname (pangalan)</Label>
          <Input id="firstname" value={firstname} onChange={(e) => setFirstname(e.target.value.toUpperCase())} placeholder="e.g., JUAN" />
        </div>

        <div className="overflow-x-auto">
          <Table className="min-w-[400px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Category</TableHead>
                {[...Array(numberOfEntries)].map((_, i) => (
                  <TableHead key={i} className="text-center w-[60px]">{i + 1}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {scoreCategories.map(category => (
                <TableRow key={category}>
                  <TableCell className="font-medium">{category}</TableCell>
                  {[...Array(numberOfEntries)].map((_, i) => (
                    <TableCell key={i} className="p-1">
                      <Input
                        type="number" // Using number to allow numeric input, but value is string
                        min="0"
                        max="100" // Assuming max score is 100
                        className="text-center h-9"
                        value={
                          category === 'Quiz' ? quizScores[i] :
                          category === 'Recitation' ? recitationScores[i] :
                          projectScores[i]
                        }
                        onChange={(e) => handleScoreChange(category, i, e.target.value)}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              <TableRow>
                <TableCell className="font-medium">{attendanceLabel}</TableCell>
                {[...Array(numberOfEntries)].map((_, i) => (
                  <TableCell key={i} className="text-center p-1">
                    <div className="flex justify-center items-center h-9">
                      <Checkbox
                        checked={attendance[i]}
                        onCheckedChange={(checked) => handleAttendanceChange(i, checked as boolean)}
                      />
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <Button onClick={handleGenerateQrCode} className="w-full btn-hover-scale">
          <QrCode className="mr-2 h-4 w-4" /> Generate QR Code
        </Button>

        {qrCodeUrl && (
          <div className="mt-6 flex flex-col items-center space-y-2">
            <Label className="text-sm font-medium">Generated QR Code:</Label>
            <div className="p-2 border rounded-md bg-muted">
              <Image 
                src={qrCodeUrl} 
                alt="Generated QR Code" 
                width={200} 
                height={200} 
                data-ai-hint="qr code student information"
              />
            </div>
            <p className="text-xs text-muted-foreground">This QR code contains your index card data. Present this to your professor for scanning.</p>
            {/* The QR code data itself is not displayed directly, only the image */}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

