import type { User } from "@prisma/client";
import { verifyToken } from "@clerk/backend";

import prisma from "@/lib/prisma";

export class AuthService {
  static async getCurrentUser(request: Request): Promise<User | null> {
    try {
      const authHeader = request.headers.get("authorization");

      // Ensure the Authorization header exists and starts with "Bearer ".
      // If not, reject the request because the user is not authenticated.
      if (!authHeader?.startsWith("Bearer ")) {
        return null;
      }

      // Remove "Bearer " from the header so only the JWT token remains.
      const token = authHeader.replace("Bearer ", "");

      // Verify the JWT using Clerk's secret key.
      // If the token is invalid or expired, verifyToken() will throw an error.

      const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY!,
      });

      // Extract the Clerk user ID from the verified token.
      // The `sub` (subject) claim uniquely identifies the authenticated user.
      const clerkUserId = payload.sub;

      // If no user ID exists in the token, treat it as invalid.
      if (!clerkUserId) {
        return null;
      }
      const user = await prisma.user.findUnique({
        where: {
          clerkId: clerkUserId,
        },
      });

      return user;
    } catch (error) {
      return null;
    }
  }

  // static async createUser(input: CreateUserInput): Promise<User> {
  //   // TODO: Create user in database after Clerk signup
  //   throw new Error('Not implemented');
  // }

  static async getUserById(id: string): Promise<User | null> {
    // TODO: Fetch user from database
    throw new Error("Not implemented");
  }
}
