import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { ScheduleService } from './schedule.service';
import { AdminScheduleController } from './admin-schedule.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule])],
  controllers: [AdminScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {}
