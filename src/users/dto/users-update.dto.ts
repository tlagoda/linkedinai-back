import { IsBoolean, IsEmail, IsString, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsBoolean()
  @IsOptional()
  canGenerate?: boolean;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsBoolean()
  @IsOptional()
  hasAuthorizedLinkedIn?: boolean;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  linkedInId?: string;

  @IsString()
  @IsOptional()
  linkedInPP?: string;

  @IsString()
  @IsOptional()
  linkedInToken?: string;

  @IsString()
  @IsOptional()
  linkedInTokenExpiresAt?: Date;

  @IsString()
  @IsOptional()
  personUrn?: string;

  @IsString()
  @IsOptional()
  apiKey?: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsOptional()
  job?: string;

  @IsBoolean()
  @IsOptional()
  useOwnApiKey?: boolean;
}
