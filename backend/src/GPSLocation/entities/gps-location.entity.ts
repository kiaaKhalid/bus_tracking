import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum BusStatus {
  EN_STATION = 'EN_STATION',
  EN_ROUTE = 'EN_ROUTE',
  MAINTENANCE = 'MAINTENANCE',
}

@Entity('gps_locations')
@Index(['busId'])
@Index(['busId', 'timestamp'])
export class GPSLocation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  busId: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @Column({ type: 'int', nullable: true })
  accuracy?: number;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  vitesse?: number;

  @Column({ type: 'int', nullable: true })
  direction?: number;

  @CreateDateColumn({ name: 'date_creation', type: 'timestamp' })
  dateCreation: Date;

  @UpdateDateColumn({ name: 'date_modification', type: 'timestamp' })
  dateModification: Date;
}
