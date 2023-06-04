import { IsNumber, IsString } from 'class-validator';

export class GeneratePostDto {
  @IsString()
  readonly prompt: string;

  @IsNumber()
  readonly maxTokens: number;

  @IsNumber()
  readonly temperature: number;
}
