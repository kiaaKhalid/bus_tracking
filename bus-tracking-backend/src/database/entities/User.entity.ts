import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';
import { Bus } from './Bus.entity';
import { Schedule } from './Schedule.entity';
import { Payment } from './Payment.entity';
import { Report } from './Report.entity';
import { PlaqueCorrection } from './PlaqueCorrection.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @IsNotEmpty()
  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @IsNotEmpty()
  @Column({ type: 'varchar', length: 150, nullable: false })
  nom: string;

  @IsEnum(UserRole)
  @Column({ type: 'enum', enum: UserRole, nullable: false })
  role: UserRole;

  @IsEnum(UserStatus)
  @Column({
    type: 'enum',
    enum: UserStatus,
    nullable: false,
    default: UserStatus.ACTIF,
  })
  statut: UserStatus;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreation: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateModification: Date;

  @OneToMany(() => Bus, (bus) => bus.createdBy)
  busesCreated: Bus[];

  @OneToMany(() => Bus, (bus) => bus.updatedBy)
  busesUpdated: Bus[];

  @OneToMany(() => Schedule, (s) => s.createdBy)
  schedulesCreated: Schedule[];

  @OneToMany(() => Schedule, (s) => s.updatedBy)
  schedulesUpdated: Schedule[];

  @OneToMany(() => Payment, (p) => p.createdBy)
  paymentsCreated: Payment[];

  @OneToMany(() => Report, (r) => r.createdBy)
  reportsCreated: Report[];

  @OneToMany(() => PlaqueCorrection, (pc) => pc.corrigeePar)
  plaqueCorrections: PlaqueCorrection[];
}
