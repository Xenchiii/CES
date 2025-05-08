
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, RefreshCcw, ScanLine } from 'lucide-react';

interface ScannedIndexCardData {
  id: string; // Unique ID for the scanned entry
  scannedAt: Date;
  studentId: string;
  surname: string;
  firstname: string;
  quizScores: string[];
  recitationScores: string[];
  projectScores: string[];
  attendance: boolean[];
}

// Mock data to simulate received scanned data
const mockScannedData: ScannedIndexCardData[] = [
  {
    id: 'scan1',
    scannedAt: new Date(Date.now() - 3600000 * 2), // 2 hours ago
    studentId: 'UA202301963',
    surname: 'CARTOJA',
    firstname: 'PRINCESS K.',
    quizScores: ['85', '90', '', '78', '92'],
    recitationScores: ['10', '15', '20', '', '18'],
    projectScores: ['', '100', '95', '', ''],
    attendance: [true, true, false, true, true],
  },
  {
    id: 'scan2',
    scannedAt: new Date(Date.now() - 3600000 * 5), // 5 hours ago
    studentId: 'UA202301234',
    surname: 'DELA CRUZ',
    firstname: 'JUAN',
    quizScores: ['70', '65', '80', '75', ''],
    recitationScores: ['12', '10', '', '15', '13'],
    projectScores: ['88', '', '90', '', '85'],
    attendance: [true, false, true, true, false],
  },
];

const scoreCategories = ['Quiz', 'Recitation', 'Project'];
const attendanceLabel = 'Attendance';
const numberOfEntries = 5;

export default function ProfessorIndexManagement() {
  const [indexData, setIndexData] = useState<ScannedIndexCardData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate fetching data on mount or when a "refresh" button is clicked
  const fetchData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIndexData(mockScannedData.sort((a, b) => b.scannedAt.getTime() - a.scannedAt.getTime())); // Sort by most recent
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const exportToCSV = () => {
    if (indexData.length === 0) {
      alert("No data to export.");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    // Headers
    const headers = [
      "Scanned At", "Student ID", "Surname", "Firstname",
      ...Array.from({ length: numberOfEntries }, (_, i) => `Quiz ${i + 1}`),
      ...Array.from({ length: numberOfEntries }, (_, i) => `Recitation ${i + 1}`),
      ...Array.from({ length: numberOfEntries }, (_, i) => `Project ${i + 1}`),
      ...Array.from({ length: numberOfEntries }, (_, i) => `Attendance ${i + 1}`),
    ];
    csvContent += headers.join(",") + "\r\n";

    // Rows
    indexData.forEach(item => {
      const row = [
        item.scannedAt.toLocaleString(),
        item.studentId,
        item.surname,
        item.firstname,
        ...item.quizScores,
        ...item.recitationScores,
        ...item.projectScores,
        ...item.attendance.map(a => a ? "Present" : "Absent")
      ];
      csvContent += row.join(",") + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `index_card_data_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="shadow-md animate-scaleUp">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2"><ScanLine className="h-5 w-5 text-primary" /> Student Index Card Data</CardTitle>
          <CardDescription>View and export scanned index card information.</CardDescription>
        </div>
        <div className="flex gap-2">
            <Button onClick={fetchData} variant="outline" disabled={isLoading}>
                <RefreshCcw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Refreshing...' : 'Refresh Data'}
            </Button>
            <Button onClick={exportToCSV} disabled={indexData.length === 0}>
                <Download className="mr-2 h-4 w-4" /> Export to CSV
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && indexData.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Loading data...</p>
        ) : indexData.length === 0 && !isLoading ? (
            <p className="text-muted-foreground text-center py-4">No index card data available yet. Scan student QR codes to populate this section.</p>
        ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                {scoreCategories.map(category => (
                  [...Array(numberOfEntries)].map((_, i) => (
                    <TableHead key={`${category}-${i}`} className="text-center min-w-[70px]">{`${category.charAt(0)}${i + 1}`}</TableHead>
                  ))
                ))}
                {[...Array(numberOfEntries)].map((_, i) => (
                  <TableHead key={`att-${i}`} className="text-center min-w-[70px]">{`Att ${i + 1}`}</TableHead>
                ))}
                <TableHead className="text-right">Scanned At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {indexData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.studentId}</TableCell>
                  <TableCell>{item.surname}, {item.firstname}</TableCell>
                  {item.quizScores.map((score, i) => <TableCell key={`q-${item.id}-${i}`} className="text-center">{score || '-'}</TableCell>)}
                  {item.recitationScores.map((score, i) => <TableCell key={`r-${item.id}-${i}`} className="text-center">{score || '-'}</TableCell>)}
                  {item.projectScores.map((score, i) => <TableCell key={`p-${item.id}-${i}`} className="text-center">{score || '-'}</TableCell>)}
                  {item.attendance.map((att, i) => <TableCell key={`a-${item.id}-${i}`} className="text-center">{att ? 'P' : 'A'}</TableCell>)}
                  <TableCell className="text-right text-xs text-muted-foreground">{item.scannedAt.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        )}
         <p className="text-xs text-muted-foreground mt-4">* Data is currently mocked. Real implementation requires a scanner app to send data to this dashboard.</p>
      </CardContent>
    </Card>
  );
}
