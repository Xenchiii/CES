import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Presentation, Code, Github, ExternalLink, Upload, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge'; // Import Badge component

// Mock Data - Replace with actual data fetching later
const mockProjects = [
  { id: 'proj1', title: 'CES Website V2', description: 'The official website built with Next.js and ShadCN UI.',imageUrlSeed: 'website-v2', tags: ['Next.js', 'TypeScript', 'Tailwind', 'ShadCN'], author: 'Developer Team', githubUrl: '#', liveUrl: '/' },
  { id: 'proj2', title: 'AI Tutoring Bot (Sparrow)', description: 'An AI companion integrated into the website using Genkit.', imageUrlSeed: 'sparrow-ai', tags: ['AI', 'Genkit', 'TypeScript'], author: 'AI Mentors', githubUrl: '#' },
  { id: 'proj3', title: 'Event Registration System API', description: 'Backend API for managing event sign-ups (Planned).', imageUrlSeed: 'api-event', tags: ['Java', 'Spring Boot', 'API', 'Planned'], author: 'Code Warriors' },
  { id: 'proj4', title: 'Algorithm Visualizer', description: 'A web tool to visualize common sorting and searching algorithms.', imageUrlSeed: 'algo-viz', tags: ['JavaScript', 'React', 'Visualization'], author: 'Algorithm Knights', liveUrl: '#' },
  { id: 'proj5', title: 'Mobile Voting App', description: 'Concept for a secure mobile voting application for student elections.', imageUrlSeed: 'mobile-vote', tags: ['Mobile', 'Concept', 'UI/UX'], author: 'Mobile Mnemonics' },
];

export default function ProjectShowcasePage() {
  // TODO: Add filtering by tags, search

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold text-center md:text-left flex items-center gap-3 animate-fadeIn">
            <Presentation className="text-accent h-9 w-9" /> Project Showcase
          </h1>
           {/* Add Project Button - Link to submission form/page */}
           <Link href="/project-showcase/submit" passHref>
             <Button className="btn-hover-scale animate-fadeIn animation-delay-100">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Your Project
             </Button>
           </Link>
      </div>

       <p className="text-center text-lg text-muted-foreground mb-12 max-w-3xl mx-auto animate-fadeIn animation-delay-100">
         Explore the innovative projects created by ICCT CES members and sub-organizations.
       </p>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
         {mockProjects.map((project, index) => (
           <Card key={project.id} className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300 animate-scaleUp" style={{ animationDelay: `${(index + 2) * 0.1}s` }}>
             <CardHeader className="p-0 relative">
                <Image
                  src={`https://picsum.photos/seed/${project.imageUrlSeed}/600/300`}
                  alt={project.title}
                  width={600}
                  height={300}
                  className="w-full h-48 object-cover"
                  data-ai-hint={`project ${project.tags.join(' ')}`}
                />
                 {/* Optional overlay */}
                 {/* <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div> */}
             </CardHeader>
             <CardContent className="p-4 flex flex-col flex-grow">
               <CardTitle className="text-xl mb-1">{project.title}</CardTitle>
               <CardDescription className="text-sm text-muted-foreground mb-2">By {project.author}</CardDescription>
               <p className="text-sm text-foreground/80 flex-grow mb-3">{project.description}</p>
               {project.tags && (
                 <div className="flex flex-wrap gap-1 mb-3">
                   {project.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                 </div>
               )}
                <div className="flex gap-2 mt-auto pt-2 border-t border-border">
                  {project.githubUrl && (
                     <Button variant="outline" size="sm" asChild>
                         <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                             <Github className="mr-1 h-4 w-4" /> GitHub
                         </a>
                     </Button>
                  )}
                   {project.liveUrl && (
                      <Button variant="default" size="sm" asChild>
                         <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                             <ExternalLink className="mr-1 h-4 w-4" /> Live Demo
                         </a>
                     </Button>
                   )}
                   {/* Add link to project detail page */}
                    {/* <Link href={`/project-showcase/${project.id}`} passHref>
                        <Button variant="link" size="sm">Details</Button>
                    </Link> */}
                </div>
             </CardContent>
           </Card>
         ))}
       </div>
        {mockProjects.length === 0 && (
           <p className="text-center text-muted-foreground mt-8 animate-fadeIn animation-delay-300">
             No projects showcased yet. Be the first to add one!
           </p>
        )}
         <p className="text-xs text-muted-foreground text-center mt-8">* Project data is mock data. Database integration and a submission process are required.</p>
    </div>
  );
}
