import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { CameraType } from '../enums/camera-type.enum';
import { CameraStatus } from '../enums/camera-status.enum';
import { MovementBus } from './MovementBus.entity';
import { Station } from './Station.entity'; // Gardez l'import pour le décorateur

@Entity('cameras')
export class Camera {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  nom: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  emplacement: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  adresseIP: string;

  @Column({ type: 'enum', enum: CameraType, nullable: false })
  type: CameraType;

  @Column({
    type: 'enum',
    enum: CameraStatus,
    nullable: false,
    default: CameraStatus.ACTIF,
  })
  statut: CameraStatus;

  @Column({ type: 'timestamp', nullable: true })
  dateInstallation: Date | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @OneToMany(() => MovementBus, (m: MovementBus) => m.camera)
  movements: MovementBus[];

  @ManyToOne(() => Station, (s: Station) => s.cameras, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  station; // ← Supprimé : Station | null (inféré par TypeORM)
}
