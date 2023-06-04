import { IsDefined, IsString, MaxLength } from 'class-validator';

export class SharePostDto {
  @IsDefined()
  @IsString()
  content: string;
}
