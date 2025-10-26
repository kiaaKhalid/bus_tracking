import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  Min,
} from 'class-validator';
import { BusStatus } from '../entities/bus.entity';

export class CreateBusDto {
  @IsString()
  @IsNotEmpty()
  plaqueImmatriculation: string;

  @IsString()
  @IsNotEmpty()
  compagnie: string;

  @IsEnum(BusStatus)
  statut: BusStatus;

  @IsInt()
  @Min(0)
  capacite: number;

  @IsOptional()
  @IsString()
  conducteur?: string;

  @IsOptional()
  @IsDateString()
  dateAcquisition?: string;

  @IsInt()
  @Min(0)
  kilometrage: number;

  @IsOptional()
  @IsDateString()
  derniereRevision?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
