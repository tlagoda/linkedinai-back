import { IsString, IsOptional, IsArray } from 'class-validator';

export class SharePostDto {
  @IsString()
  readonly content: string;

  @IsArray()
  @IsOptional()
  readonly images?: ArrayBuffer[];

  @IsOptional()
  readonly video?: ArrayBuffer;
}