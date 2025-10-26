import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Camera } from './Camera.entity';
import { Schedule } from './Schedule.entity';

@Entity('stations')
export class Station {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  nom: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  adresse: string;

  @Column({ type: 'int', nullable: false })
  capacite: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  telephone: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  responsable: string | null;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreation: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  dateModification: Date;

  @OneToMany(() => Camera, (c) => c.station)
  cameras: Camera[];

  @OneToMany(() => Schedule, (s) => s.station)
  schedules: Schedule[];
}
