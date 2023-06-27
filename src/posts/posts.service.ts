import { FirebaseService } from 'src/firebase/firebase.service';
import { SharePostDto } from './dto/posts-share.dto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration, OpenAIApi } from 'openai';
import axios from 'axios';

@Injectable()
export class PostsService {
  private openai: OpenAIApi;

  constructor(
    private configService: ConfigService,
    private firebaseService: FirebaseService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    const configuration = new Configuration({
      organization: 'org-oyGJgWrLh8lYCJF01HvjlHYw',
      apiKey,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async generate(prompt: string) {
    try {
      const response = await this.openai.createCompletion({
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 1000,
        temperature: 0.5,
        n: 1,
      });

      return response.data.choices[0];
    } catch (err: any) {
      return err.response;
    }
  }

  async shareOnLinkedIn(postContent: SharePostDto, token: string) {
    try {
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
      console.error('Error posting share:', error);
    }
  }
}
