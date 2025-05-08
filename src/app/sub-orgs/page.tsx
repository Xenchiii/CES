import prisma from '@/lib/prisma'; // Use aliased path
// import { Prisma } from '@prisma/client'; // Import Prisma namespace
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { BrainCircuit, Sparkles, Code, ShieldCheck, Palette, Cpu, Smartphone, Globe, University } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SubOrganization } from '@prisma/client'; // Keep type import
import { Prisma } from '@prisma/client'; // Re-add Prisma namespace import

// Map slugs to icons (or store icon names in DB)
const subOrgIcons: { [key: string]: React.ElementType } = {
  'ai-mentors': BrainCircuit,
  'algorithm-knights': Sparkles,
  'code-warriors': Code,
  'cybernet-rangers': ShieldCheck,
  'digital-expressionists': Palette,
  'ghz-builders': Cpu,
  'mobile-mnemonics': Smartphone,
  'web-arachnids': Globe,
};

// Mock data consistent with the schema in [slug]/page.tsx - Keep for fallback
const mockSubOrgsData: SubOrganization[] = [
    { SubOrgID: 1, Slug: 'ai-mentors', Name: 'AI Mentors', Leader: 'Frederick C.', Description: 'Focuses on AI and ML.' },
    { SubOrgID: 2, Slug: 'algorithm-knights', Name: 'Algorithm Knights', Leader: 'Amalia R.', Description: 'Competitive programming.' },
    { SubOrgID: 3, Slug: 'code-warriors', Name: 'Code Warriors', Leader: 'Ronald Z.', Description: 'Software development practices.' },
    { SubOrgID: 4, Slug: 'cybernet-rangers', Name: 'Cybernet Rangers', Leader: null, Description: 'Focuses on cybersecurity.' },
    { SubOrgID: 5, Slug: 'digital-expressionists', Name: 'Digital Expressionists', Leader: 'Diana J.', Description: 'Digital art and UI/UX.' },
    { SubOrgID: 6, Slug: 'ghz-builders', Name: 'GHZ Builders', Leader: 'Princess C.', Description: 'Hardware and PC building.' },
    { SubOrgID: 7, Slug: 'mobile-mnemonics', Name: 'Mobile Mnemonics', Leader: null, Description: 'Mobile app development.' },
    { SubOrgID: 8, Slug: 'web-arachnids', Name: 'Web Arachnids', Leader: 'Rica A.', Description: 'Web development.' },
];


export default async function SubOrgsPage() {
    let subOrgs: SubOrganization[] = [];
    try {
      // START: TEMPORARILY COMMENTED OUT PRISMA CALLS DUE TO libssl ERROR
      // // Fetch sub-organizations from the database
      // subOrgs = await prisma.subOrganization.findMany({
      //   orderBy: {
      //       Name: 'asc',
      //   },
      // });
      console.warn("Prisma calls temporarily disabled in SubOrgs page due to environment issue (missing libssl). Using mock data.");
      subOrgs = mockSubOrgsData; // Use mock data as fallback
      // END: TEMPORARILY COMMENTED OUT PRISMA CALLS

    } catch (error) {
        console.error("Failed to fetch sub-orgs data (or using fallback):", error);
         subOrgs = mockSubOrgsData; // Use mock data as fallback
    }


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-10 flex items-center justify-center gap-3 animate-fadeIn">
        <University className="text-accent h-9 w-9" /> Sub-Organizations
      </h1>
      <p className="text-center text-lg text-muted-foreground mb-12 max-w-3xl mx-auto animate-fadeIn animation-delay-200">
        Dive deeper into specialized fields within computer science. Join a sub-organization that matches your passion and interests!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {subOrgs.map((org, index) => {
          const OrgIcon = subOrgIcons[org.Slug] || University; // Fallback icon
          return (
            <Card key={org.SubOrgID} className="flex flex-col justify-between hover:shadow-xl transition-shadow duration-300 animate-scaleUp" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="items-center text-center">
                    <OrgIcon className="h-12 w-12 text-primary mb-3 icon-rotate-hover" />
                    <CardTitle className="text-xl">{org.Name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center flex-grow">
                    <CardDescription>{org.Description}</CardDescription>
                </CardContent>
                <div className="p-4 pt-0 text-center">
                    <Link href={`/sub-orgs/${org.Slug}`} passHref>
                        <Button variant="outline" className="w-full btn-hover-shadow">
                            Learn More
                        </Button>
                    </Link>
                </div>
            </Card>
          );
        })}
      </div>
       {subOrgs.length === 0 && (
            <Card className="animate-fadeIn animation-delay-200">
                <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">No sub-organizations found.</p>
                </CardContent>
            </Card>
       )}
    </div>
  );
}

