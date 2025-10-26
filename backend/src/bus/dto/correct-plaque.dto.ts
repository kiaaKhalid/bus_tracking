import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CorrectPlaqueDto {
  @IsString()
  @IsNotEmpty()
  correctedPlaque: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
