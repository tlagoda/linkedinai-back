import { SharePostDto } from './../posts/dto/posts-share.dto';
import { FirebaseService } from './../firebase/firebase.service';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LinkedinService {
  private readonly logger = new Logger(LinkedinService.name);

  constructor(private firebaseService: FirebaseService) {}

  async share(postContent: SharePostDto, token: string) {
    try {
      return;
      const { uid } = await this.firebaseService.getAuth().verifyIdToken(token);
      const linkedinRef = this.firebaseService
        .getFirestore()
        .collection('linkedin')
        .doc(uid);

      const snapshot = await linkedinRef.get();
      const linkedinData = snapshot.data();

      if (!linkedinData || !linkedinData.linkedInId) {
        throw new Error('Invalid linkedIn token');
      }

      const shareContent = {
        author: `urn:li:person:${linkedinData.linkedInId}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: postContent.content,
            },
            shareMediaCategory: 'NONE',
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      };

      const response = await axios.post(
        'https://api.linkedin.com/v2/ugcPosts',
        shareContent,
        {
          headers: {
            'X-Restli-Protocol-Version': '2.0.0',
            Authorization: `Bearer ${linkedinData.linkedInToken}`,
          },
        },
      );
      const postId = response.data.id;
      return { postId };
    } catch (error) {
      this.logger.error('Error posting share:', error);
    }
  }

  async registerMedia(personUrn: string, token: string, isVideo = false) {
    this.logger.log(
      `Registering media(${
        isVideo ? 'video' : 'image'
      }) for user #${personUrn}`,
    );

    const registerUploadRequest = {
      recipes: [
        `urn:li:digitalmediaRecipe:feedshare-${isVideo ? 'video' : 'image'}`,
      ],
      owner: `urn:li:person:${personUrn}`,
      serviceRelationships: [
        {
          relationshipType: 'OWNER',
          identifier: 'urn:li:userGeneratedContent',
        },
      ],
    };

    const response = await axios.post(
      'https://api.linkedin.com/v2/assets?action=registerUpload',
      { registerUploadRequest },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      },
    );

    return response.data;
  }

  async uploadMedia(
    uploadUrl: string,
    imageBuffer: Buffer,
    accessToken: string,
  ) {
    this.logger.log(`Uploading media...`);

    const response = await axios.post(uploadUrl, imageBuffer, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/octet-stream',
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    return response.data;
  }

  async createMediaShare(
    personUrn: string,
    accessToken: string,
    text: string,
    imageAssets: string[],
    isVideo = false,
  ) {
    this.logger.log(
      `Creating media share (${
        isVideo ? 'video' : 'image'
      }) for user #${personUrn}...`,
    );

    const media = imageAssets.map((asset) => {
      return {
        status: 'READY',
        description: {
          text: 'Description of the image',
        },
        media: asset,
        title: {
          text: 'Title of the image',
        },
      };
    });

    const shareContent = {
      author: `urn:li:person:${personUrn}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text,
          },
          shareMediaCategory: isVideo ? 'VIDEO' : 'IMAGE',
          media,
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    };

    const response = await axios.post(
      'https://api.linkedin.com/v2/ugcPosts',
      shareContent,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      },
    );
    return response.data;
  }
}
