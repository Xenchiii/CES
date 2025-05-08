import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';

export default function JobsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 flex items-center justify-center gap-3 animate-fadeIn">
        <Briefcase className="text-accent h-9 w-9" /> Job Board & Internships
      </h1>

      <Card className="shadow-xl animate-scaleUp">
        <CardHeader>
          <CardTitle>Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The job board is currently under construction. Relevant job and internship opportunities will be posted here soon.
          </p>
          {/* Add job listing components here */}
        </CardContent>
      </Card>
    </div>
  );
}

