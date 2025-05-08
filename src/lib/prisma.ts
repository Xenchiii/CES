// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'; // Import default client
import { withAccelerate } from '@prisma/extension-accelerate'; // Import Accelerate extension

// Declare globalThis.prisma to avoid issues during hot-reloading in development
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Use globalThis.prisma in development, create a new client in production
const prismaClientSingleton = () => {
    // Initialize PrismaClient with Accelerate
    // Use the default engine ('library' or 'binary') which is compatible with Accelerate
    return new PrismaClient().$extends(withAccelerate());
};

// Use globalThis.prisma in development, create a new client in production
const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;
