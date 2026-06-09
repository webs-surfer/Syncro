import type { User, CreateUserInput } from '@/types';

export class AuthService {
  static async getCurrentUser(): Promise<User | null> {
    // TODO: Integrate with Clerk
    throw new Error('Not implemented');
  }

  static async createUser(input: CreateUserInput): Promise<User> {
    // TODO: Create user in database after Clerk signup
    throw new Error('Not implemented');
  }

  static async getUserById(id: string): Promise<User | null> {
    // TODO: Fetch user from database
    throw new Error('Not implemented');
  }
}
