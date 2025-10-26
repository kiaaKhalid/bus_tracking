import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { ReportService } from './report.service';
import { AdminReportsController } from './admin-reports.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Report])],
  controllers: [AdminReportsController],
  providers: [ReportService],
})
export class ReportModule {}
