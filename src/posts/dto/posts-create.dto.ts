import { IsNumber, IsString } from 'class-validator';

export class GenerateDto {
  @IsString()
  readonly prompt: string;

  @IsNumber()
  readonly maxTokens: number;

  @IsNumber()
  readonly temperature: number;
}
