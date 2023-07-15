import { LinkedinService } from './../linkedin/linkedin.service';
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
    private linkedinService: LinkedinService,
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

  async shareOnLinkedIn(
    postContent: SharePostDto,
    token: string,
    files?: Express.Multer.File[] | null,
  ) {
    try {
      // share with just text
      if (!files?.length) {
        return await this.linkedinService.share(postContent, token);
      }

      // share with media
      const auth = await this.firebaseService.getAuth();
      const decodedToken = await auth.verifyIdToken(token);

      const linkedinUserInformations = await this.firebaseService.getDoc(
        'linkedin',
        decodedToken.uid,
      );

      const personUrn = linkedinUserInformations.data().personUrn;
      const linkedinAccessToken = linkedinUserInformations.data().linkedInToken;

      const resp = await this.linkedinService.registerImage(
        personUrn,
        linkedinAccessToken,
      );

      console.log(resp);
      const binaryFiles = [];
      for (const file of files) {
        binaryFiles.push(file.buffer);
      }
    } catch (error) {
      console.error('Error posting share:', error);
    }
  }
}
