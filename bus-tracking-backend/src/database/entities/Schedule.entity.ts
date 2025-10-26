import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Bus } from './Bus.entity';
import { ScheduleStatus } from '../enums/schedule-status.enum';
import { DayOfWeek } from '../enums/day-of-week.enum';
import { MovementBus } from './MovementBus.entity';
import { Station } from './Station.entity';
import { User } from './User.entity';

@Entity('schedules')
@Index('idx_schedules_bus_ligne', ['busId', 'ligne'])
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  ligne: string;

  @Column({ type: 'varchar', length: 5, nullable: false })
  heureDepartPrevue: string;

  @Column({ type: 'varchar', length: 5, nullable: false })
  heureArriveePrevue: string;

  @Column({ type: 'uuid', nullable: false })
  busId: string;

  @Column({ type: 'simple-array', nullable: false })
  jours: DayOfWeek[];

  @Column({
    type: 'enum',
    enum: ScheduleStatus,
    nullable: false,
    default: ScheduleStatus.ACTIF,
  })
  statut: ScheduleStatus;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreation: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateModification: Date;

  @ManyToOne(() => Bus, (b) => b.schedules, { onDelete: 'CASCADE' })
  bus: Bus;

  @OneToMany(() => MovementBus, (m) => m.schedule)
  movements: MovementBus[];

  @ManyToOne(() => Station, (s) => s.schedules, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  station;

  @ManyToOne(() => User, (u) => u.schedulesCreated, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  createdBy;

  @ManyToOne(() => User, (u) => u.schedulesUpdated, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  updatedBy;
}
