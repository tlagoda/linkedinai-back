import { IsNumber, IsString } from 'class-validator';
import { prompt1 } from '../prompts/prompts';

export class GenerateDto {
  @IsString()
  readonly prompt: string = prompt1;

  @IsNumber()
  readonly maxTokens: number = 200;

  @IsNumber()
  readonly temperature: number = 0.5;
}
