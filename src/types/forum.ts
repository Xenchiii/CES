import type { LucideIcon } from 'lucide-react';

export interface ForumCategory {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon; // Or React.ElementType if using other icon libraries
}

export interface ForumThread {
  id: string;
  categoryId: string;
  title: string;
  authorId: string; // User ID
  createdAt: Date;
  lastReplyAt: Date;
  replyCount: number;
  viewCount: number;
  isSticky?: boolean; // Pinned threads
  isLocked?: boolean; // Closed threads
}

export interface ForumPost {
  id: string;
  threadId: string;
  authorId: string; // User ID
  content: string; // HTML content from rich text editor
  createdAt: Date;
  upvotes: number;
  isBestAnswer?: boolean;
  // Add attachments field if needed: attachments?: { name: string; url: string; type: string }[];
}

// Simple User type for mock data association
export interface ForumUser {
  id: string;
  name: string;
  avatarUrl: string;
  role?: 'admin' | 'moderator' | 'member'; // Optional role
}
