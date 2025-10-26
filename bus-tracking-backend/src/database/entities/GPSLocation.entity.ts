import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { IsLatitude, IsLongitude, IsOptional } from 'class-validator';
import { Bus } from './Bus.entity';
import { MovementBus } from './MovementBus.entity';

@Entity('gps_locations')
@Index('idx_gps_bus_timestamp', ['busId', 'timestamp'])
export class GPSLocation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid', nullable: false })
  busId: string;

  @IsLatitude()
  @Column({ type: 'double', nullable: false })
  latitude: number;

  @IsLongitude()
  @Column({ type: 'double', nullable: false })
  longitude: number;

  @IsOptional()
  @Column({ type: 'double', nullable: true })
  accuracy: number | null;

  @Index()
  @Column({ type: 'timestamp', nullable: false })
  timestamp: Date;

  @IsOptional()
  @Column({ type: 'double', nullable: true })
  vitesse: number | null;

  @IsOptional()
  @Column({ type: 'double', nullable: true })
  direction: number | null;

  @ManyToOne(() => Bus, (b) => b.locations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'busId' })
  bus: Bus;

  @OneToOne(() => MovementBus, (m) => m.location, { nullable: true })
  movement; // ← Supprimé : MovementBus | null (inféré par TypeORM)
}
