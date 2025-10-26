import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEnum, IsOptional } from 'class-validator';
import { BusStatus } from '../enums/bus-status.enum';
import { Schedule } from './Schedule.entity';
import { MovementBus } from './MovementBus.entity';
import { Payment } from './Payment.entity';
import { GPSLocation } from './GPSLocation.entity';
import { User } from './User.entity';

@Entity('buses')
export class Bus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50, nullable: false })
  plaqueImmatriculation: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  compagnie: string;

  @IsEnum(BusStatus)
  @Column({
    type: 'enum',
    enum: BusStatus,
    nullable: false,
    default: BusStatus.EN_STATION,
  })
  statut: BusStatus;

  @Column({ type: 'int', nullable: false })
  capacite: number;

  @IsOptional()
  @Column({ type: 'varchar', length: 150, nullable: true })
  conducteur: string | null;

  @IsOptional()
  @Column({ type: 'timestamp', nullable: true })
  dateAcquisition: Date | null;

  @Column({ type: 'float', nullable: false, default: 0 })
  kilometrage: number;

  @IsOptional()
  @Column({ type: 'timestamp', nullable: true })
  derniereRevision: Date | null;

  @IsOptional()
  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreation: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateModification: Date;

  @ManyToOne(() => User, (u) => u.busesCreated, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  createdBy: User | null;

  @ManyToOne(() => User, (u) => u.busesUpdated, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  updatedBy: User | null;

  @OneToMany(() => Schedule, (s: Schedule) => s.bus)
  schedules: Schedule[];

  @OneToMany(() => MovementBus, (m: MovementBus) => m.bus)
  movements: MovementBus[];

  @OneToMany(() => Payment, (p: Payment) => p.bus)
  payments: Payment[];

  @OneToMany(() => GPSLocation, (g: GPSLocation) => g.bus)
  locations: GPSLocation[];
}
