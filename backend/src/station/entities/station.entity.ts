import { Camera } from 'src/camera/entities/camera.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';

@Entity('stations')
@Index(['nom'])
export class Station {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nom: string;

  @Column()
  adresse: string;

  @Column({ type: 'int' })
  capacite: number;

  @Column({ nullable: true })
  telephone?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  responsable?: string;

  @OneToMany(() => Camera, (camera) => camera.station, { nullable: true })
  cameras?: Camera[];

  @OneToMany(() => Schedule, (schedule) => schedule.station, { nullable: true })
  schedules?: Schedule[];

  @CreateDateColumn({ name: 'date_creation', type: 'timestamp' })
  dateCreation: Date;

  @UpdateDateColumn({ name: 'date_modification', type: 'timestamp' })
  dateModification: Date;
}
