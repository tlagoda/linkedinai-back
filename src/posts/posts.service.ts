import { LinkedinService } from './../linkedin/linkedin.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration, OpenAIApi } from 'openai';
import { PromptOptionsDto } from './dto/posts-prompt-options.dto';

@Injectable()
export class PostsService {
  private openai: OpenAIApi;
  private readonly logger = new Logger(PostsService.name);

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

  async canGenerate(token: string) {
    const firebaseUser = await this.firebaseService
      .getAuth()
      .verifyIdToken(token);

    const userSnapshot = await this.firebaseService.getDoc(
      'users',
      firebaseUser.uid,
    );

    if (!userSnapshot.exists) {
      return false;
    }

    const userData = userSnapshot.data();

    if (!userData.canGenerate) {
      return false;
    }
    return true;
  }

  async generate(prompt: string) {
    try {
      const response = await this.openai.createCompletion({
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 1000,
        temperature: 1,
        n: 1,
      });

      const usage = response.data.usage;
      this.logger.warn(
        `Request used ${usage.total_tokens} tokens. (prompt: ${usage.prompt_tokens} / generated: ${usage.completion_tokens})`,
      );

      return response.data.choices[0];
    } catch (err: any) {
      return err.response;
    }
  }

  buildPrompt(options: PromptOptionsDto): string {
    const promptParts = [
      'I need you to create a tweet.',
      'Feel free to use line breaks and emojis if you think it adds value to the post.',
    ];
    if (options.postTopic) {
      promptParts.push(
        `I'm targeting ${options.targetAudience}, and I want to share a ${options.postTopic} post.`,
      );
    }

    if (options.tone) {
      promptParts.push(`The tone of the post should be ${options.tone}.`);
    }

    if (options.postLength) {
      promptParts.push(`The post should be ${options.postLength}.`);
    }

    if (options.postObjective) {
      promptParts.push(`My objective is to ${options.postObjective}.`);
    }

    if (options.callToAction) {
      promptParts.push(
        `At the end, I would like to include a call to action, so for example you can "${options.callToAction}".`,
      );
    }

    const prompt = promptParts.join(' ');

    return prompt;
  }

  async shareOnLinkedIn(
    postContent: string,
    token: string,
    files?: Express.Multer.File[] | null,
  ) {
    this.logger.log(
      `User requested to share on LinkedIn, with${
        !files ? 'out' : ` ${files.length}`
      } files...`,
    );
    try {
      if (files?.length > 9) {
        throw new Error('Too many files, max 9.');
      }
      // share with just text
      if (!files?.length) {
        return await this.linkedinService.share(
          { content: postContent },
          token,
        );
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

      if (!linkedinUserInformations || !personUrn || !linkedinAccessToken) {
        this.logger.warn(
          'Unable to retrieve all required informations to share on LinkedIn...',
        );
        throw new InternalServerErrorException('Missing LinkedIn information');
      }

      const fileAssets = [];
      for (const file of files) {
        const registerResponse = await this.linkedinService.registerMedia(
          personUrn,
          linkedinAccessToken,
          isVideo,
        );
        const uploadUrl =
          registerResponse.value.uploadMechanism[
            'com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'
          ].uploadUrl;

        fileAssets.push(registerResponse.value.asset);

        await this.linkedinService.uploadMedia(
          uploadUrl,
          file.buffer,
          linkedinAccessToken,
        );
      }

      await this.linkedinService.createMediaShare(
        personUrn,
        linkedinAccessToken,
        postContent,
        fileAssets,
        isVideo,
      );
    } catch (error) {
      this.logger.error('Error posting share:', error);
    }
  }
}
