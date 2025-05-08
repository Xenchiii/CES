import type { ForumCategory, ForumThread, ForumPost } from '@/types/forum';
import { BookOpen, Users, Bell, Settings, Shield, Share2, Code, Sigma, FileText, Link, MessageSquare, Brain, Briefcase, GraduationCap } from 'lucide-react';

// Mock Categories
export const forumCategories: ForumCategory[] = [
    { id: 'hw-help', slug: 'hw-help', title: "Homework Help", description: "Ask and answer questions related to assignments.", icon: BookOpen },
    { id: 'class-disc', slug: 'class-disc', title: "Class Discussions", description: "Discuss topics covered in specific classes.", icon: Users },
    { id: 'study-groups', slug: 'study-groups', title: "Study Groups", description: "Form or join study groups.", icon: Users },
    { id: 'announcements', slug: 'announcements', title: "Announcements", description: "Official announcements from CES/Faculty.", icon: Bell },
    { id: 'extracurricular', slug: 'extracurricular', title: "Extracurricular Activities", description: "Discuss clubs, sports, and events.", icon: Brain }, // Changed icon
    { id: 'career-guidance', slug: 'career-guidance', title: "College & Career Guidance", description: "Ask about applications, internships, careers.", icon: GraduationCap }, // Changed icon
    { id: 'resources', slug: 'resources', title: "Resources & Study Materials", description: "Share study guides, links, etc.", icon: Share2 },
    { id: 'tech-support', slug: 'tech-support', title: "Technical Support", description: "Ask about school tech (LMS, software).", icon: Settings },
    { id: 'feedback', slug: 'feedback', title: "Feedback & Suggestions", description: "Give feedback on policies, suggest improvements.", icon: MessageSquare }, // Changed icon
    { id: 'guidelines', slug: 'guidelines', title: "Rules & Guidelines", description: "Forum rules and posting etiquette.", icon: Shield },
];

// Mock Users (simplified)
const users = {
    'user1': { id: 'user1', name: 'Lian Mae P.', avatarUrl: 'https://picsum.photos/seed/officer1/40/40' },
    'user2': { id: 'user2', name: 'Ronald Z.', avatarUrl: 'https://picsum.photos/seed/dev3/40/40' },
    'user3': { id: 'user3', name: 'Amalia R.', avatarUrl: 'https://picsum.photos/seed/leader2/40/40' },
    'admin1': { id: 'admin1', name: 'Admin User', avatarUrl: 'https://picsum.photos/seed/admin/40/40', role: 'admin' },
};

// Mock Threads
export const forumThreads: ForumThread[] = [
    {
        id: 'thread1',
        categoryId: 'hw-help',
        title: 'Struggling with Recursion Assignment',
        authorId: 'user2',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        lastReplyAt: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
        replyCount: 3,
        viewCount: 25,
        isSticky: false,
        isLocked: false,
    },
    {
        id: 'thread2',
        categoryId: 'hw-help',
        title: 'Need help understanding Big O notation',
        authorId: 'user3',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        lastReplyAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        replyCount: 5,
        viewCount: 50,
        isSticky: false,
        isLocked: false,
    },
    {
        id: 'thread3',
        categoryId: 'announcements',
        title: 'Upcoming Midterm Exam Schedule',
        authorId: 'admin1', // Admin post
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        lastReplyAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        replyCount: 0,
        viewCount: 150,
        isSticky: true,
        isLocked: true,
    },
    {
        id: 'thread4',
        categoryId: 'class-disc',
        title: 'Discussion: Pros and Cons of Python vs Java',
        authorId: 'user1',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        lastReplyAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        replyCount: 8,
        viewCount: 75,
        isSticky: false,
        isLocked: false,
    },
     {
        id: 'thread5',
        categoryId: 'resources',
        title: 'Useful Free Online Courses for Web Development',
        authorId: 'user2',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        lastReplyAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        replyCount: 2,
        viewCount: 110,
        isSticky: false,
        isLocked: false,
    },
];

// Mock Posts
export const forumPosts: ForumPost[] = [
    {
        id: 'post1',
        threadId: 'thread1',
        authorId: 'user2',
        content: "<p>Hey everyone, I'm really stuck on the recursive function part of the latest assignment. Can anyone explain how the base case works in this context?</p>",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        upvotes: 2,
        isBestAnswer: false,
    },
    {
        id: 'post2',
        threadId: 'thread1',
        authorId: 'user1',
        content: "<p>The base case is what stops the recursion! Think about the simplest possible input where you already know the answer. For factorials, it's usually factorial(0) or factorial(1) returning 1.</p><pre><code class='language-javascript'>function factorial(n) {\n  // Base case\n  if (n === 0 || n === 1) {\n    return 1;\n  }\n  // Recursive step\n  return n * factorial(n - 1);\n}</code></pre>",
        createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
        upvotes: 5,
        isBestAnswer: true, // Marked as best answer
    },
    {
        id: 'post3',
        threadId: 'thread1',
        authorId: 'user3',
        content: "<p>Good explanation @user1! Also, make sure you're actually *reducing* the problem towards the base case in your recursive step (like `n - 1` in the factorial example).</p>",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        upvotes: 3,
        isBestAnswer: false,
    },
    {
        id: 'post4',
        threadId: 'thread1',
        authorId: 'user2',
        content: "<p>Ah, that makes more sense now! Thanks, @user1 and @user3!</p>",
        createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
        upvotes: 1,
        isBestAnswer: false,
    },
    {
        id: 'post5',
        threadId: 'thread3',
        authorId: 'admin1',
        content: "<p>Please find the Midterm Exam schedule attached. Exams will run from June 5th to June 8th, 2025. Good luck!</p><p><a href='/link/to/schedule.pdf' target='_blank'>Midterm_Schedule.pdf</a></p>", // Example link
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        upvotes: 10,
        isBestAnswer: false,
    },
    // Add more posts for other threads...
     {
        id: 'post6',
        threadId: 'thread2',
        authorId: 'user3',
        content: "<p>Can someone provide a simple explanation of O(n^2) complexity?</p>",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        upvotes: 1,
        isBestAnswer: false,
    },
    {
        id: 'post7',
        threadId: 'thread2',
        authorId: 'user1',
        content: "<p>Think of nested loops. If you have a loop inside another loop, and both loops iterate 'n' times based on the input size, the total operations grow quadratically (n * n). That's roughly O(n^2).</p>",
        createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000),
        upvotes: 4,
        isBestAnswer: false,
    },
     {
        id: 'post8',
        threadId: 'thread4',
        authorId: 'user1',
        content: "<p>Let's discuss! I prefer Python for its readability and large library ecosystem, especially for data science and AI.</p>",
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        upvotes: 3,
        isBestAnswer: false,
    },
     {
        id: 'post9',
        threadId: 'thread4',
        authorId: 'user2',
        content: "<p>Java's strong typing and performance are great for large-scale enterprise applications though. The JVM is a powerful thing!</p>",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        upvotes: 2,
        isBestAnswer: false,
    },
];

// Function to get threads for a category
export const getThreadsForCategory = (categoryId: string): ForumThread[] => {
    return forumThreads.filter(thread => thread.categoryId === categoryId);
};

// Function to get posts for a thread
export const getPostsForThread = (threadId: string): ForumPost[] => {
    return forumPosts.filter(post => post.threadId === threadId);
};

// Function to get user details
export const getUserById = (userId: string): { id: string; name: string; avatarUrl: string; role?: string } | undefined => {
    return users[userId];
};

// Function to get category details by slug
export const getCategoryBySlug = (slug: string): ForumCategory | undefined => {
    return forumCategories.find(cat => cat.slug === slug);
};

// Function to get thread details by ID
export const getThreadById = (threadId: string): ForumThread | undefined => {
    return forumThreads.find(thread => thread.id === threadId);
};
