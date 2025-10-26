import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { DayOfWeek, ScheduleStatus } from '../entities/schedule.entity';

export class CreateScheduleDto {
  @IsString()
  @IsNotEmpty()
  ligne: string;

  @IsString()
  @IsNotEmpty()
  heureDepartPrevue: string; // HH:MM

  @IsString()
  @IsNotEmpty()
  heureArriveePrevue: string; // HH:MM

  @IsString()
  @IsNotEmpty()
  busId: string;

  @IsArray()
  @IsEnum(DayOfWeek, { each: true })
  jours: DayOfWeek[];

  @IsEnum(ScheduleStatus)
  statut: ScheduleStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
