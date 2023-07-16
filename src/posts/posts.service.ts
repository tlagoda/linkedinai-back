import { LinkedinService } from './../linkedin/linkedin.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { SharePostDto } from './dto/posts-share.dto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration, OpenAIApi } from 'openai';
import FileType from 'file-type';

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

      const isVideo = files[0].originalname.startsWith('video');

      // share with media
      const auth = this.firebaseService.getAuth();
      const decodedToken = await auth.verifyIdToken(token);

      const linkedinUserInformations = await this.firebaseService.getDoc(
        'linkedin',
        decodedToken.uid,
      );

      const personUrn = linkedinUserInformations.data().personUrn;
      const linkedinAccessToken = linkedinUserInformations.data().linkedInToken;

      const response = await this.linkedinService.registerMedia(
        personUrn,
        linkedinAccessToken,
        isVideo,
      );
      const uploadUrl =
        response.value.uploadMechanism[
          'com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'
        ].uploadUrl;
      const asset = response.value.asset;

      const binaryFiles = [];
      for (const file of files) {
        binaryFiles.push(file.buffer);
      }

      const r = await this.linkedinService.uploadMedia(
        uploadUrl,
        binaryFiles[0],
        linkedinAccessToken,
      );

      const uu = await this.linkedinService.createMediaShare(
        personUrn,
        linkedinAccessToken,
        'dabbb',
        asset,
        isVideo,
      );
    } catch (error) {
      console.error('Error posting share:', error);
    }
  }
}
