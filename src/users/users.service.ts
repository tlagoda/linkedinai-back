import { UpdateUserDto } from './dto/users-update.dto';
import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private firebaseService: FirebaseService) {}

  async updateUser(uid: string, data: UpdateUserDto): Promise<void> {
    const sanitizedData = this.sanitizeUserData(data);
    try {
      const userRef = this.firebaseService
        .getFirestore()
        .collection('users')
        .doc(uid);
      await userRef.set(sanitizedData, { merge: true });
    } catch (error) {
      this.logger.error('Error updating user:', error);
      throw error;
    }
  }

  sanitizeUserData(data: Partial<UpdateUserDto>): Partial<UpdateUserDto> {
    return {
      ...(data.canGenerate && { canGenerate: data.canGenerate }),
      ...(data.email && { email: data.email }),
      ...(data.firstName && { firstName: data.firstName }),
      ...(data.hasAuthorizedLinkedIn && {
        hasAuthorizedLinkedIn: data.hasAuthorizedLinkedIn,
      }),
      ...(data.lastName && { lastName: data.lastName }),
      ...(data.linkedInId && { linkedInId: data.linkedInId }),
      ...(data.linkedInPP && { linkedInPP: data.linkedInPP }),
      ...(data.linkedInToken && { linkedInToken: data.linkedInToken }),
      ...(data.linkedInTokenExpiresAt && {
        linkedInTokenExpiresAt: data.linkedInTokenExpiresAt,
      }),
      ...(data.personUrn && { personUrn: data.personUrn }),
      ...(data.apiKey && { apiKey: data.apiKey }),
      ...(data.job && { job: data.job }),
      ...(data.company && { company: data.company }),
      ...(data.useOwnApiKey !== null &&
        data.useOwnApiKey !== undefined && { useOwnApiKey: data.useOwnApiKey }),
    };
  }
}
