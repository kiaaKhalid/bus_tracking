import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bus } from './entities/bus.entity';
import { BusService } from './bus.service';
import { AdminBusController } from './admin-bus.controller';
import { MovementBus } from './entities/movement-bus.entity';
import { PlaqueCorrection } from './entities/plaque-correction.entity';
import { MovementService } from './movement.service';
import { AdminMovementController } from './admin-movement.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Bus, MovementBus, PlaqueCorrection])],
  controllers: [AdminBusController, AdminMovementController],
  providers: [BusService, MovementService],
})
export class BusModule {}
