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
import { Bus } from '../../bus/entities/bus.entity';
import { Station } from '../../station/entities/station.entity';

export enum DayOfWeek {
  LUNDI = 'LUNDI',
  MARDI = 'MARDI',
  MERCREDI = 'MERCREDI',
  JEUDI = 'JEUDI',
  VENDREDI = 'VENDREDI',
  SAMEDI = 'SAMEDI',
  DIMANCHE = 'DIMANCHE',
}

export enum ScheduleStatus {
  ACTIF = 'ACTIF',
  INACTIF = 'INACTIF',
  SUSPENDU = 'SUSPENDU',
}

@Entity('schedules')
@Index(['busId'])
@Index(['ligne'])
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ligne: string;

  @Column({ type: 'time' })
  heureDepartPrevue: string;

  @Column({ type: 'time' })
  heureArriveePrevue: string;

  @Column()
  busId: string;

  @ManyToOne(() => Bus, { nullable: true })
  @JoinColumn({ name: 'busId' })
  bus?: Bus;

  @Column({ type: 'set', enum: DayOfWeek })
  jours: DayOfWeek[];

  @Column({
    type: 'enum',
    enum: ScheduleStatus,
    default: ScheduleStatus.ACTIF,
  })
  statut: ScheduleStatus;

  @Column({ nullable: true, type: 'text' })
  notes?: string;

  @Column({ nullable: true })
  stationId?: string;

  @ManyToOne(() => Station, { nullable: true })
  @JoinColumn({ name: 'stationId' })
  station?: Station;

  @CreateDateColumn({ name: 'date_creation', type: 'timestamp' })
  dateCreation: Date;

  @UpdateDateColumn({ name: 'date_modification', type: 'timestamp' })
  dateModification: Date;
}
