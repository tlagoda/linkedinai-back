import { IsDefined, IsString } from 'class-validator';

export class SharePostDto {
  @IsDefined()
  @IsString()
  content: string;
}
