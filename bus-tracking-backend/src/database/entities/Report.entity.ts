import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReportType } from '../enums/report-type.enum';
import { ReportStatus } from '../enums/report-status.enum';
import { User } from './User.entity';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ReportType, nullable: false })
  typeRapport: ReportType;

  @Column({ type: 'timestamp', nullable: false })
  dateDebut: Date;

  @Column({ type: 'timestamp', nullable: false })
  dateFin: Date;

  @Column({
    type: 'enum',
    enum: ReportStatus,
    nullable: false,
    default: ReportStatus.EN_COURS,
  })
  statut: ReportStatus;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateGeneration: Date;

  @Column({ type: 'json', nullable: true })
  donneesJSON: Record<string, any> | null;

  @ManyToOne(() => User, (u) => u.reportsCreated, { onDelete: 'CASCADE' })
  createdBy: User;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
