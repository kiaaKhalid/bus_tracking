import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import type { IncomingHttpHeaders } from 'http';
import { RateLimitModule } from './rate-limit/rate-limit.module';
import { RequestLoggingInterceptor } from './common/interceptors/request-logging.interceptor';
import { BatchModule } from './batch/batch.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { GPSLocation } from './GPSLocation/entities/gps-location.entity';
import { Camera } from './camera/entities/camera.entity';

import { createPool } from 'mysql2/promise';

import { Bus } from './bus/entities/bus.entity';
import { MovementBus } from './bus/entities/movement-bus.entity';
import { PlaqueCorrection } from './bus/entities/plaque-correction.entity';
import { BusModule } from './bus/bus.module';
import { BusWithLocation } from './GPSLocation/entities/bus-with-location.entity';
import { Payment } from './payment/entities/payment.entity';
import { Schedule } from './schedule/entities/schedule.entity';
import { Station } from './station/entities/station.entity';
import { Report } from './report/entities/report.entity';
import { ScheduleModule } from './schedule/schedule.module';
import { ReportModule } from './report/report.module';
import { SystemModule } from './system/system.module';

async function ensureDatabaseExists() {
  const host = process.env.DB_HOST!;
  const port = Number(process.env.DB_PORT || 3306);
  const user = process.env.DB_USER!;
  const password = process.env.DB_PASSWORD!;
  const database = process.env.DB_NAME!;

  const pool = createPool({
    host,
    port,
    user,
    password,
    waitForConnections: true,
    ssl:
      process.env.NODE_ENV === 'production'
        ? { ca: process.env.DB_CA_CERT_PATH!.replace(/\\n/g, '\n') }
        : undefined,
  });

  try {
    await pool.query(
      `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
    );
  } finally {
    await pool.end();
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        if (process.env.NODE_ENV !== 'production') {
          await ensureDatabaseExists();
        }

        return {
          type: 'mysql',
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          entities: [
            User,
            Bus,
            MovementBus,
            PlaqueCorrection,
            Camera,
            GPSLocation,
            BusWithLocation,
            Payment,
            Report,
            Schedule,
            Station,
          ],
          synchronize: process.env.NODE_ENV !== 'production', // jamais en prod !
        } as const;
      },
    }),
    UsersModule,
    AuthModule,
    BusModule,
    ScheduleModule,
    ReportModule,
    SystemModule,
    BatchModule.forRoot(
      {
        concurrency: 2,
        defaultMaxAttempts: 5,
        initialBackoffMs: 500,
        maxBackoffMs: 30_000,
        pollIntervalMs: 1_000,
      },
      {
        // Example job handlers (replace with real implementations later)
        'orders.export': (payload: { from?: string; to?: string }) => {
          console.log('Running orders.export job with payload:', payload);
          return Promise.resolve();
        },
        generic: () => {
          console.log('Running generic job');
          return Promise.resolve();
        },
      },
    ),
    RateLimitModule.forRoot({
      trustProxy: true, // behind reverse proxy / CDN in prod
      // Prefer per-user limiting when JWT is present, fallback to IP if anonymous
      keyStrategy: 'user',
      // Global defaults
      refillRatePerSec: 5,
      burstCapacity: 100,
      cost: 1,
      idleExpireSeconds: 3600,
      // Whitelist routes (health checks, public assets/APIs)
      whitelist: ['/health', '/api/public', /^\/public\//],
      // Per-role overrides (higher quotas for admins)
      rolePolicies: {
        VIEWER: { refillRatePerSec: 5, burstCapacity: 100 },
        ORGANIZER: { refillRatePerSec: 10, burstCapacity: 200 },
        ADMIN: { refillRatePerSec: 15, burstCapacity: 300 },
      },
      // Fallback user id resolver (dev tools, no JWT)
      userIdResolver: (req: { headers: IncomingHttpHeaders; user?: any }) => {
        const val = req.headers['x-user-id'];
        const hdr = Array.isArray(val) ? val[0] : val;
        if (typeof hdr === 'string') return hdr;
        return undefined;
      },
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggingInterceptor,
    },
  ],
})
export class AppModule {}
