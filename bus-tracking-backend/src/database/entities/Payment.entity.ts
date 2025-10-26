import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  CreateDateColumn,
} from 'typeorm';
import { PaymentMethod } from '../enums/payment-method.enum';
import { PaymentStatus } from '../enums/payment-status.enum';
import { Bus } from './Bus.entity';
import { User } from './User.entity';

@Entity('payments')
@Index('idx_payments_bus_date', ['busId', 'datePaiement'])
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  busId: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  busPlaque: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: false })
  montant: string;

  @Column({ type: 'timestamp', nullable: false })
  datePaiement: Date;

  @Column({ type: 'enum', enum: PaymentMethod, nullable: false })
  methode: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    nullable: false,
    default: PaymentStatus.EN_ATTENTE,
  })
  statut: PaymentStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reference: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreation: Date;

  @ManyToOne(() => Bus, (b) => b.payments, { onDelete: 'CASCADE' })
  bus: Bus;

  @ManyToOne(() => User, (u) => u.paymentsCreated, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  createdBy: User | null;
}
