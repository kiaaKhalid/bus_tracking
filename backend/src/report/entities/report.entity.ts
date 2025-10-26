import { User } from 'src/users/entities/user.entity';
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

export enum ReportType {
  PERFORMANCE = 'PERFORMANCE',
  AFFLUENCE = 'AFFLUENCE',
  ANOMALIE = 'ANOMALIE',
}

export enum ReportStatus {
  EN_COURS = 'EN_COURS',
  COMPLETE = 'COMPLETE',
  ERREUR = 'ERREUR',
}

@Entity('reports')
@Index(['createdBy'])
@Index(['typeRapport'])
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ReportType,
    default: ReportType.PERFORMANCE,
  })
  typeRapport: ReportType;

  @Column({ type: 'timestamp' })
  dateDebut: Date;

  @Column({ type: 'timestamp' })
  dateFin: Date;

  @Column({
    type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.EN_COURS,
  })
  statut: ReportStatus;

  @Column({ type: 'timestamp', name: 'date_generation' })
  dateGeneration: Date;

  @Column({ type: 'json' })
  donneesJSON: object;

  @Column()
  createdBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'createdBy' })
  createdByUser?: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
