import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum BusStatus {
  EN_STATION = 'EN_STATION',
  EN_ROUTE = 'EN_ROUTE',
  MAINTENANCE = 'MAINTENANCE',
}

@Entity('buses')
export class Bus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  plaqueImmatriculation: string;

  @Column()
  compagnie: string;

  @Column({
    type: 'enum',
    enum: BusStatus,
    default: BusStatus.EN_STATION,
  })
  statut: BusStatus;

  @Column({ type: 'int' })
  capacite: number;

  @Column({ nullable: true })
  conducteur?: string;

  @Column({ type: 'timestamp', nullable: true, name: 'date_acquisition' })
  dateAcquisition?: Date;

  @Column({ type: 'int' })
  kilometrage: number;

  @Column({ type: 'timestamp', nullable: true, name: 'derniere_revision' })
  derniereRevision?: Date;

  @Column({ nullable: true, type: 'text' })
  notes?: string;

  @CreateDateColumn({ name: 'date_creation', type: 'timestamp' })
  dateCreation: Date;

  @UpdateDateColumn({ name: 'date_modification', type: 'timestamp' })
  dateModification: Date;
}
