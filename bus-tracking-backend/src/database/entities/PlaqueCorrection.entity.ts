import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { MovementBus } from './MovementBus.entity';
import { User } from './User.entity';

@Entity('plaque_corrections')
export class PlaqueCorrection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  movementId: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  plaqueOriginale: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  plaqueCorrrigee: string;

  @Column({ type: 'text', nullable: true })
  raison: string | null;

  @Column({ type: 'uuid', nullable: true })
  corrigeeParUserId: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCorrection: Date;

  @ManyToOne(() => MovementBus, (m) => m.corrections, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movementId' })
  movement: MovementBus;

  @ManyToOne(() => User, (u) => u.plaqueCorrections, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'corrigeeParUserId' })
  corrigeePar: User | null;
}
