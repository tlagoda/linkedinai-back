import { IsNumber, IsString } from 'class-validator';

export class GeneratePostDto {
  @IsString()
  readonly prompt: string;
}
