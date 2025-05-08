
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Info, Target, Users, History, ShieldCheck, Code, UsersRound } from 'lucide-react';

// Officer Data
const cesOfficers = [
  { name: 'Lian Mae A. Pantaleon', position: 'President', imageSeed: 'officer1' },
  { name: 'Cyril John A. Noynay', position: 'Vice President', imageSeed: 'officer2' },
  { name: 'Willie John T. Icaro', position: 'Secretary', imageSeed: 'officer3' },
  { name: 'Ma. Gheleen V. Malabanan', position: 'Assistant Secretary', imageSeed: 'officer4' },
  { name: 'Mary Yovhel R. Gamas', position: 'Treasurer', imageSeed: 'officer5' },
  { name: 'Amalia Angela Remiendo', position: 'Auditor', imageSeed: 'officer6' },
  { name: 'Reiner C. Felias', position: 'Project Manager', imageSeed: 'officer7' },
  { name: 'Venice Margarette B. Niebres', position: 'Assistant Project Manager', imageSeed: 'officer8' },
  { name: 'Princess Khazanabelle Cartoja', position: 'Assistant Project Manager', imageSeed: 'officer9' },
  { name: 'Gemica May N. Rivera', position: 'Social Media Manager', imageSeed: 'officer10' },
];

const developerTeam = [
  { name: 'Prince Cartoja', position: 'Lead Developer / Initiator', imageSeed: 'dev0' }, // Added Prince
  { name: 'Jeremiah R. Rey', position: 'Senior Developer', imageSeed: 'dev1' },
  { name: 'Romano Ycoy', position: 'Senior Developer', imageSeed: 'dev2' },
  { name: 'Ronald Christopher M. Zapanta', position: 'Junior Developer', imageSeed: 'dev3' },
  { name: 'Sairon Akir S. Nacionales', position: 'Junior Developer', imageSeed: 'dev4' },
  { name: 'Leonce F. Ganancios', position: 'Junior Developer', imageSeed: 'dev5' },
  { name: 'Kristine Mae G. Sacariz', position: 'Junior Developer', imageSeed: 'dev6' },
  { name: 'Glenmar D. Agosto', position: 'Junior Developer', imageSeed: 'dev7' },
];

const icsoOfficers = [
  { name: 'DIana Rose R. Joven', position: 'President', imageSeed: 'icso1' },
  { name: 'Mark Vince G. Catabuena', position: 'Vice President', imageSeed: 'icso2' },
  { name: 'Rica Mae E. Arellano', position: 'Secretary', imageSeed: 'icso3' },
  { name: 'Jordan S. Panganiban', position: 'Treasurer', imageSeed: 'icso4' },
  { name: 'Mary John B. Buluran', position: 'Auditor', imageSeed: 'icso5' },
  { name: 'Rodel Adrian O. Romana', position: 'Public Relations Officer', imageSeed: 'icso6' },
  { name: 'Frederick F. Carigma', position: 'Social Media Manager', imageSeed: 'icso7' },
];

const subOrgLeaders = [
    { name: 'Frederick F. Carigma', position: 'AI Mentors Captain', imageSeed: 'leader1' },
    { name: 'Amalia Angela Remiendo', position: 'Algorithm Knights Captain', imageSeed: 'leader2' },
    { name: 'Ma. Gheleen V. Malabanan', position: 'Algorithm Knights Commander', imageSeed: 'leader3' },
    { name: 'Ronald Christopher M. Zapanta', position: 'Code Warriors Captain', imageSeed: 'leader4' },
    { name: 'Rafael F. Baluyot', position: 'Code Warriors Commander', imageSeed: 'leader5' },
    { name: 'Diana Rose R. Joven', position: 'Digital Expressionists Captain', imageSeed: 'leader6' },
    { name: 'Mark Vince G. Catabuena', position: 'Digital Expressionists Commander', imageSeed: 'leader7' },
    { name: 'Princess Khazanabelle Cartoja', position: 'GHZ Builders Captain', imageSeed: 'leader8' },
    { name: 'Rodel Adrian O. Romana', position: 'GHZ Builders Commander', imageSeed: 'leader9' },
    { name: 'Rica Mae E. Arellano', position: 'Web Arachnids Captain', imageSeed: 'leader10' },
    { name: 'Jordan S. Panganiban', position: 'Web Arachnids Commander', imageSeed: 'leader11' },
];


const OfficerCard = ({ name, position, imageSeed }: { name: string, position: string, imageSeed: string }) => (
  <Card className="text-center hover:shadow-lg transition-shadow duration-300 animate-scaleUp">
    <CardHeader className="items-center">
      <Image
        src={`https://picsum.photos/seed/${imageSeed}/200/200`}
        alt={name}
        width={100}
        height={100}
        className="rounded-full mb-3 ring-2 ring-accent p-1"
        data-ai-hint="person portrait student"
      />
      <CardTitle className="text-lg">{name}</CardTitle>
      <CardDescription>{position}</CardDescription>
    </CardHeader>
    {/* Optional: Add brief description or contact in CardContent */}
  </Card>
);

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-16">
      <h1 className="text-4xl font-bold text-center mb-10 flex items-center justify-center gap-3 animate-fadeIn">
        <Info className="text-accent h-9 w-9" /> About ICCT CES - Antipolo
      </h1>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="animate-slideInFromLeft">
          <h2 className="text-3xl font-semibold mb-4 flex items-center gap-2"><Target className="h-7 w-7 text-primary"/> Our Mission</h2>
          <p className="text-lg text-foreground/80 leading-relaxed">
            To foster a community of passionate and skilled computer science students at ICCT Colleges, Antipolo Campus. We aim to provide opportunities for learning, collaboration, and innovation in the field of technology, preparing members for future careers and challenges.
          </p>
        </div>
        <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg animate-slideInFromRight">
          <Image
            src="https://picsum.photos/seed/mission/600/400"
            alt="Mission illustration"
            layout="fill"
            objectFit="cover"
             data-ai-hint="team working collaboration target"
          />
           <div className="absolute inset-0 bg-primary/30"></div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
         <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg order-last md:order-first animate-slideInFromLeft animation-delay-100">
           <Image
             src="https://picsum.photos/seed/history/600/400"
             alt="History illustration"
             layout="fill"
             objectFit="cover"
             data-ai-hint="old photos campus history scroll"
           />
            <div className="absolute inset-0 bg-primary/30"></div>
         </div>
        <div className="order-first md:order-last animate-slideInFromRight animation-delay-100">
          <h2 className="text-3xl font-semibold mb-4 flex items-center gap-2"><History className="h-7 w-7 text-primary"/> Our History</h2>
          <p className="text-lg text-foreground/80 leading-relaxed">
            Founded in [Year - e.g., 2010], the Computer Explorer Society at the Antipolo campus has grown from a small group of enthusiasts into a thriving organization. We have consistently worked towards enhancing the technical skills and professional development of our members through various activities and events.
          </p>
        </div>
      </section>

      {/* CES Officers Section */}
      <section className="animate-fadeIn animation-delay-200">
        <h2 className="text-3xl font-semibold text-center mb-8 flex items-center justify-center gap-2"><Users className="h-7 w-7 text-primary"/> CES Officers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cesOfficers.map((officer, index) => (
             <OfficerCard key={`ces-${index}`} {...officer} />
          ))}
        </div>
      </section>

       {/* Developer Team Section */}
       <section className="animate-fadeIn animation-delay-300">
         <h2 className="text-3xl font-semibold text-center mb-8 flex items-center justify-center gap-2"><Code className="h-7 w-7 text-primary"/> Developer Team</h2>
         <p className="text-center text-muted-foreground mb-4">Initiated by Prince Cartoja</p> {/* Added note about initiator */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {developerTeam.map((member, index) => (
             <OfficerCard key={`dev-${index}`} {...member} />
           ))}
         </div>
       </section>

        {/* ICSO Officers Section */}
       <section className="animate-fadeIn animation-delay-400">
         <h2 className="text-3xl font-semibold text-center mb-8 flex items-center justify-center gap-2"><UsersRound className="h-7 w-7 text-primary"/> ICSO Officers</h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {icsoOfficers.map((officer, index) => (
              <OfficerCard key={`icso-${index}`} {...officer} />
           ))}
         </div>
       </section>

        {/* Sub-Organization Captains and Commanders Section */}
       <section className="animate-fadeIn animation-delay-500">
         <h2 className="text-3xl font-semibold text-center mb-8 flex items-center justify-center gap-2"><ShieldCheck className="h-7 w-7 text-primary"/> Sub-Organization Leaders</h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {subOrgLeaders.map((leader, index) => (
              <OfficerCard key={`leader-${index}`} {...leader} />
           ))}
         </div>
       </section>

    </div>
  );
}
