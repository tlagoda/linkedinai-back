import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration, OpenAIApi } from 'openai';

@Injectable()
export class PostsService {
  private openai: OpenAIApi;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    const configuration = new Configuration({
      organization: 'org-oyGJgWrLh8lYCJF01HvjlHYw',
      apiKey,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async generate() {
    return 'text by chat-gpt';
  }
}
