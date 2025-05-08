import prisma from '@/lib/prisma'; // Use aliased path
// import { Prisma } from '@prisma/client'; // Import Prisma namespace
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, BrainCircuit, Sparkles, Code, ShieldCheck, Palette, Cpu, Smartphone, Globe, University } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { notFound } from 'next/navigation'; // Import notFound
import type { SubOrganization } from '@prisma/client'; // Keep type import
import { Prisma } from '@prisma/client'; // Re-add Prisma namespace import

// Map slugs to icons and potentially fetch other static data if needed
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

// Mock data for fields not in DB yet (replace/remove as DB schema grows)
// Extended mock data to include necessary fields from Prisma type
const additionalOrgData: { [key: string]: Partial<SubOrganization> & { activities?: string[], image?: string, dataAiHint?: string } } = {
  'ai-mentors': { SubOrgID: 1, Name: 'AI Mentors', Leader: 'Frederick C.', Description: 'Focuses on AI and ML.', activities: ['Workshops on ML libraries', 'Research paper discussions', 'AI project collaborations'], image: 'https://picsum.photos/seed/ai/800/400', dataAiHint: 'artificial intelligence brain' },
  'algorithm-knights': { SubOrgID: 2, Name: 'Algorithm Knights', Leader: 'Amalia R.', Description: 'Competitive programming.', activities: ['Weekly coding challenges', 'Algorithm study groups', 'Contest preparation sessions'], image: 'https://picsum.photos/seed/algo/800/400', dataAiHint: 'knight chessboard logic' },
  'code-warriors': { SubOrgID: 3, Name: 'Code Warriors', Leader: 'Ronald Z.', Description: 'Software development practices.', activities: ['Code reviews and pair programming', 'Software architecture talks', 'Open source contribution drives'], image: 'https://picsum.photos/seed/code/800/400', dataAiHint: 'programming code screen' },
  'cybernet-rangers': { SubOrgID: 4, Name: 'Cybernet Rangers', Leader: null, Description: 'Focuses on cybersecurity.', activities: ['Capture The Flag (CTF) competitions', 'Security tool workshops', 'Guest lectures from industry experts'], image: 'https://picsum.photos/seed/cyber/800/400', dataAiHint: 'cyber security shield lock' },
  'digital-expressionists': { SubOrgID: 5, Name: 'Digital Expressionists', Leader: 'Diana J.', Description: 'Digital art and UI/UX.', activities: ['UI/UX design challenges', 'Multimedia software tutorials', 'Portfolio building sessions'], image: 'https://picsum.photos/seed/design/800/400', dataAiHint: 'digital art design palette' },
  'ghz-builders': { SubOrgID: 6, Name: 'GHZ Builders', Leader: 'Princess C.', Description: 'Hardware and PC building.', activities: ['PC building workshops', 'Hardware troubleshooting clinics', 'Overclocking and performance tuning'], image: 'https://picsum.photos/seed/hardware/800/400', dataAiHint: 'computer hardware components cpu' },
  'mobile-mnemonics': { SubOrgID: 7, Name: 'Mobile Mnemonics', Leader: null, Description: 'Mobile app development.', activities: ['App development tutorials (iOS/Android)', 'Cross-platform framework workshops (React Native/Flutter)', 'Mobile UI/UX best practices'], image: 'https://picsum.photos/seed/mobile/800/400', dataAiHint: 'mobile app development phone' },
  'web-arachnids': { SubOrgID: 8, Name: 'Web Arachnids', Leader: 'Rica A.', Description: 'Web development.', activities: ['Full-stack project development', 'Framework workshops (React, Vue, Node.js)', 'Web performance optimization talks'], image: 'https://picsum.photos/seed/web/800/400', dataAiHint: 'web development globe code' },
};

interface SubOrgPageProps {
  params: { slug: string };
}

// Fetch data for a specific sub-org
async function getSubOrg(slug: string) {
    let org: SubOrganization | null = null;
    try {
        // START: TEMPORARILY COMMENTED OUT PRISMA CALLS DUE TO libssl ERROR
        // org = await prisma.subOrganization.findUnique({
        //     where: { Slug: slug },
        // });
        console.warn(`Prisma call temporarily disabled for getSubOrg(${slug}) due to environment issue (missing libssl). Using mock data.`);
        org = (additionalOrgData[slug] as SubOrganization) || null; // Use mock data
        // END: TEMPORARILY COMMENTED OUT PRISMA CALLS

        if (!org) {
            return null;
        }

        // Combine DB data with additional static/mock data
        const extraData = additionalOrgData[slug] || {};
        return {
            ...org,
            ...extraData,
        };
    } catch (error) {
        console.error(`Failed to fetch sub-org data for ${slug} (or using fallback):`, error);
        // Fallback to mock data if Prisma fails
        const mockOrgData = additionalOrgData[slug];
        if (mockOrgData && mockOrgData.Name) { // Check if mock data exists
             return {
                 ...mockOrgData,
                 Slug: slug, // Ensure slug is set
                 SubOrgID: mockOrgData.SubOrgID || 0, // Provide a default ID if missing
             } as SubOrganization & { activities?: string[], image?: string, dataAiHint?: string };
        }
        return null; // Return null if both Prisma and mock data fail
    }
}

export default async function SubOrgDetailPage({ params }: SubOrgPageProps) {
  const org = await getSubOrg(params.slug);

  if (!org) {
    notFound(); // Use Next.js notFound function
  }

  const OrgIcon = subOrgIcons[org.Slug] || University; // Fallback icon

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Link href="/sub-orgs" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors link-underline-grow animate-fadeIn">
        <ArrowLeft className="h-4 w-4" />
        Back to Sub-Organizations
      </Link>

      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 animate-fadeIn animation-delay-100">
        <OrgIcon className="h-16 w-16 md:h-24 md:w-24 text-primary flex-shrink-0" />
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{org.Name}</h1>
          <p className="text-lg md:text-xl text-muted-foreground">{org.Description}</p>
           {org.Leader && <p className="text-md text-muted-foreground mt-1">Leader: {org.Leader}</p>}
        </div>
      </div>

      <Card className="overflow-hidden shadow-lg animate-fadeIn animation-delay-200">
        {org.image && (
          <CardHeader className="p-0">
            <Image
              src={org.image}
              alt={org.Name}
              width={800}
              height={400}
              className="w-full h-64 md:h-80 object-cover"
              data-ai-hint={org.dataAiHint || 'organization group activity'}
            />
          </CardHeader>
        )}
        <CardContent className="p-6 md:p-8">
          <CardTitle className="text-2xl mb-4">Activities & Focus</CardTitle>
          {org.activities && org.activities.length > 0 ? (
            <ul className="list-disc list-inside space-y-2 text-foreground/80">
              {org.activities.map((activity: string, index: number) => (
                <li key={index}>{activity}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">Details about activities coming soon!</p>
          )}
        </CardContent>
      </Card>

      <div className="text-center mt-10 animate-fadeIn animation-delay-300">
        <Link href="/membership" passHref>
          <Button size="lg" className="btn-hover-scale btn-hover-shadow">
            Join {org.Name} Now!
          </Button>
        </Link>
      </div>
    </div>
  );
}

// Generate static paths for all sub-orgs at build time
export async function generateStaticParams() {
    try {
      // START: TEMPORARILY COMMENTED OUT PRISMA CALLS DUE TO libssl ERROR
      // const subOrgs = await prisma.subOrganization.findMany({
      //   select: { Slug: true },
      // });
       console.warn("Prisma call temporarily disabled in generateStaticParams for sub-orgs due to environment issue (missing libssl). Using mock data slugs.");
       const subOrgs = Object.keys(additionalOrgData).map(slug => ({ Slug: slug }));
       // END: TEMPORARILY COMMENTED OUT PRISMA CALLS

      return subOrgs.map((org) => ({
        slug: org.Slug,
      }));
    } catch (error) {
        console.error("Failed to generate static params for sub-orgs (or using fallback):", error);
        // Fallback to generating paths based on mock data keys
        return Object.keys(additionalOrgData).map(slug => ({
            slug: slug,
        }));
    }
}

