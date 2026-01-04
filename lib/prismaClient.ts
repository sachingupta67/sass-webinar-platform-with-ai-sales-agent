// -----------------------------------------------------------------------------
// PURPOSE OF THIS FILE
// -----------------------------------------------------------------------------
// Next.js (especially in development mode) hot-reloads files frequently.
// Every reload would normally create a new PrismaClient instance, which can
// quickly exhaust the database connection limit and cause errors like:
//
//   "PrismaClientInitializationError: Too many connections"
//
// To prevent this, we store the PrismaClient instance on the global object.
// This ensures that during development, PrismaClient is created only ONCE and
// reused across all module reloads.
//
// In production, hot reloading does not happen, so we simply create a fresh
// PrismaClient without storing it globally.
// -----------------------------------------------------------------------------

import { PrismaClient } from "./generated/prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
