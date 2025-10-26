import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Bus } from './bus.entity';
import { Camera } from '../../camera/entities/camera.entity';

export enum MovementStatus {
  EN_RETARD = 'EN_RETARD',
  A_L_HEURE = 'A_L_HEURE',
  EN_AVANCE = 'EN_AVANCE',
}

@Entity('movement_buses')
@Index(['busId'])
@Index(['cameraId'])
@Index(['busId', 'dateCreation'])
export class MovementBus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  busId: string;

  @ManyToOne(() => Bus, { nullable: true })
  @JoinColumn({ name: 'busId' })
  bus?: Bus;

  @Column()
  plaqueDetectee: string;

  @Column({ type: 'timestamp', nullable: true, name: 'heure_entree' })
  heureEntree?: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'heure_sortie' })
  heureSortie?: Date;

  @Column({
    type: 'enum',
    enum: MovementStatus,
    default: MovementStatus.A_L_HEURE,
  })
  statut: MovementStatus;

  @Column()
  cameraId: string;

  @ManyToOne(() => Camera, { nullable: true })
  @JoinColumn({ name: 'cameraId' })
  camera?: Camera;

  @Column({ nullable: true })
  driver?: string;

  @Column({ type: 'int', nullable: true })
  occupancy?: number;

  @Column({ type: 'decimal', precision: 3, scale: 2 })
  confidence: number;

  @Column()
  urlImagePlaque: string;

  @CreateDateColumn({ type: 'timestamp', name: 'date_creation' })
  dateCreation: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'date_modification' })
  dateModification?: Date;
}
