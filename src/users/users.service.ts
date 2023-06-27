import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private firebaseService: FirebaseService) {}

  async updateUser(uid: string, data: Record<string, any>): Promise<void> {
    try {
      const userRef = this.firebaseService
        .getFirestore()
        .collection('users')
        .doc(uid);
      await userRef.set(data, { merge: true });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
}
