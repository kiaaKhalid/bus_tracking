import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Station } from 'src/station/entities/station.entity';

export enum CameraType {
  ENTREE = 'ENTREE',
  SORTIE = 'SORTIE',
  CHECKPOINT = 'CHECKPOINT',
}

export enum CameraStatus {
  ACTIF = 'ACTIF',
  INACTIF = 'INACTIF',
}

@Entity('cameras')
export class Camera {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nom: string;

  @Column()
  emplacement: string;

  @Column({ unique: true })
  adresseIP: string;

  @Column({
    type: 'enum',
    enum: CameraType,
    default: CameraType.CHECKPOINT,
  })
  type: CameraType;

  @Column({
    type: 'enum',
    enum: CameraStatus,
    default: CameraStatus.ACTIF,
  })
  statut: CameraStatus;

  @Column({ type: 'timestamp', nullable: true, name: 'date_installation' })
  dateInstallation?: Date;

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
