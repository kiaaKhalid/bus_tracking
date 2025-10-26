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
import { MovementBus } from './movement-bus.entity';
import { User } from '../../users/entities/user.entity';

@Entity('plaque_corrections')
@Index(['movementId'])
export class PlaqueCorrection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  movementId: string;

  @ManyToOne(() => MovementBus, { nullable: true })
  @JoinColumn({ name: 'movementId' })
  movement?: MovementBus;

  @Column()
  plaqueOriginale: string;

  @Column()
  plaqueCorrigee: string;

  @Column({ nullable: true })
  raison?: string;

  @Column()
  corrigeeParUserId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'corrigeeParUserId' })
  corrigeePar?: User;

  @CreateDateColumn({ name: 'date_correction', type: 'timestamp' })
  dateCorrection: Date;

  @CreateDateColumn({ name: 'date_creation', type: 'timestamp' })
  dateCreation: Date;

  @UpdateDateColumn({ name: 'date_modification', type: 'timestamp' })
  dateModification: Date;
}
