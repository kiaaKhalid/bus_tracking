import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/User.entity';
import { Bus } from './entities/Bus.entity';
import { GPSLocation } from './entities/GPSLocation.entity';
import { Camera } from './entities/Camera.entity';
import { MovementBus } from './entities/MovementBus.entity';
import { PlaqueCorrection } from './entities/PlaqueCorrection.entity';
import { Schedule } from './entities/Schedule.entity';
import { Payment } from './entities/Payment.entity';
import { Station } from './entities/Station.entity';
import { Report } from './entities/Report.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'bus_tracking',
  synchronize: false,
  logging: false,
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
  subscribers: [],
});

export default AppDataSource;
