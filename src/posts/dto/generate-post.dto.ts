import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class GeneratePostDto {
  @IsOptional()
  @IsBoolean()
  free: boolean;

  @IsOptional()
  @IsString()
  postTopic?: string;

  @IsOptional()
  @IsString()
  tone?: string;

  @IsOptional()
  @IsString()
  postLength?: string;

  @IsOptional()
  @IsString()
  targetAudience?: string;

  @IsOptional()
  @IsString()
  postObjective?: string;

  @IsOptional()
  @IsString()
  callToAction?: string;

  @IsOptional()
  @IsString()
  additionalInfo?: string;
}
