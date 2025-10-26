import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Station } from '../station/entities/station.entity';
import { SystemService } from './system.service';
import { AdminSystemController } from './admin-system.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Station])],
  controllers: [AdminSystemController],
  providers: [SystemService],
})
export class SystemModule {}
