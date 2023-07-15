import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreatePostDto {
  @IsString()
  readonly content: string;

  @IsArray()
  @IsOptional()
  readonly images?: ArrayBuffer[];

  @IsOptional()
  readonly video?: ArrayBuffer;
}