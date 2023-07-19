import { IsOptional, IsString } from 'class-validator';

export class PromptOptionsDto {
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
