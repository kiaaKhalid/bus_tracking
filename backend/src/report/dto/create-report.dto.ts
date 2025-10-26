import { IsDateString, IsEnum } from 'class-validator';
import { ReportType } from '../entities/report.entity';

export class CreateReportDto {
  @IsEnum(ReportType)
  typeRapport: ReportType;

  @IsDateString()
  dateDebut: string;

  @IsDateString()
  dateFin: string;
}
