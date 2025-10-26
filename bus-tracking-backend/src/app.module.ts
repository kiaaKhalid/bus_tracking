import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './database/entities/User.entity';
import { Bus } from './database/entities/Bus.entity';
import { GPSLocation } from './database/entities/GPSLocation.entity';
import { Camera } from './database/entities/Camera.entity';
import { MovementBus } from './database/entities/MovementBus.entity';
import { PlaqueCorrection } from './database/entities/PlaqueCorrection.entity';
import { Schedule } from './database/entities/Schedule.entity';
import { Payment } from './database/entities/Payment.entity';
import { Station } from './database/entities/Station.entity';
import { Report } from './database/entities/Report.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || 3306),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'bus_tracking',
      entities: [
        User,
        Bus,
        GPSLocation,
        Camera,
        MovementBus,
        PlaqueCorrection,
        Schedule,
        Payment,
        Station,
        Report,
      ],
      // Use env flags to control schema actions. Run once with DB_SYNC=true (and optionally DB_DROP=true on a fresh DB),
      // then set them to false so schema won't be altered again.
      synchronize: (process.env.DB_SYNC || 'false') === 'true',
      dropSchema: (process.env.DB_DROP || 'false') === 'true',
      logging: (process.env.DB_LOGGING || 'false') === 'true',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
