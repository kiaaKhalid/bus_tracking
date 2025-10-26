import { Bus } from 'src/bus/entities/bus.entity';
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

export enum PaymentMethod {
  QR = 'QR',
  CB = 'CB',
  ESPECES = 'ESPECES',
  VIREMENT = 'VIREMENT',
}

export enum PaymentStatus {
  PAYE = 'PAYE',
  EN_ATTENTE = 'EN_ATTENTE',
}

@Entity('payments')
@Index(['busId'])
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  busId: string;

  @ManyToOne(() => Bus, { nullable: true })
  @JoinColumn({ name: 'busId' })
  bus?: Bus;

  @Column()
  busPlaque: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  montant: number;

  @Column({ type: 'timestamp', name: 'date_paiement' })
  datePaiement: Date;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.QR,
  })
  methode: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.EN_ATTENTE,
  })
  statut: PaymentStatus;

  @Column({ nullable: true })
  reference?: string;

  @Column({ nullable: true, type: 'text' })
  notes?: string;

  @Column({ nullable: true })
  createdBy?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'createdBy' })
  createdByUser?: User;

  @CreateDateColumn({ name: 'date_creation', type: 'timestamp' })
  dateCreation: Date;

  @UpdateDateColumn({ name: 'date_modification', type: 'timestamp' })
  dateModification: Date;
}
