import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
} from 'typeorm';
import { Min, Max } from 'class-validator';
import { MovementStatus } from '../enums/movement-status.enum';
import { Bus } from './Bus.entity';
import { Camera } from './Camera.entity';
import { PlaqueCorrection } from './PlaqueCorrection.entity';
import { Schedule } from './Schedule.entity'; // Gardez l'import pour le décorateur
import { GPSLocation } from './GPSLocation.entity';

@Entity('movement_bus')
@Index('idx_movement_bus_bus_created', ['busId', 'dateCreation'])
export class MovementBus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  busId: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  plaqueDetectee: string;

  @Column({ type: 'timestamp', nullable: true })
  heureEntree: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  heureSortie: Date | null;

  @Column({ type: 'enum', enum: MovementStatus, nullable: false })
  statut: MovementStatus;

  @Column({ type: 'uuid', nullable: false })
  cameraId: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  driver: string | null;

  @Column({ type: 'int', nullable: true })
  occupancy: number | null;

  @Min(0)
  @Max(100)
  @Column({ type: 'double', nullable: false })
  confidence: number;

  @Column({ type: 'varchar', length: 1024, nullable: false })
  urlImagePlaque: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreation: Date;

  @ManyToOne(() => Bus, (b: Bus) => b.movements, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'busId' })
  bus: Bus;

  @ManyToOne(() => Camera, (c: Camera) => c.movements, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cameraId' })
  camera: Camera;

  @OneToMany(() => PlaqueCorrection, (p: PlaqueCorrection) => p.movement)
  corrections: PlaqueCorrection[];

  @ManyToOne(() => Schedule, (s: Schedule) => s.movements, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  schedule; // ← Supprimé : Schedule | null (inféré par TypeORM)

  @OneToOne(() => GPSLocation, (g: GPSLocation) => g.movement, {
    nullable: true,
  })
  @JoinColumn()
  location; // ← Supprimé : GPSLocation | null (inféré par TypeORM)
}
