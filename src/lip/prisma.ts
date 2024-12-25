// prisma.ts
import { PrismaClient } from "@prisma/client";
import { EventEmitter } from "events";

// Increase the maximum number of listeners
EventEmitter.defaultMaxListeners = 20; // Adjust this as needed

const prisma = new PrismaClient();

// Cleanup function to disconnect from the database on app termination
const cleanup = async () => {
  await prisma.$disconnect();
  process.exit(0);
};

// Handle termination signals
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

export default prisma;
