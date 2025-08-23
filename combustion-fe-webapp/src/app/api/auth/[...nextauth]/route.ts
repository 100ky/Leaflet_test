/**
 * NextAuth.js API route handler for authentication
 *
 * This file exposes the GET and POST handlers for authentication endpoints
 * using the configuration from '@/auth'.
 * 
 */
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
