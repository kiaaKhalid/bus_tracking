import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { AuthProvider } from './auth-provider.enum';
import { Role } from '../../common/enums/role.enum';
import { UserStatus } from './user-status.enum';

@Entity('users')
@Index(['role'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Exclude({ toPlainOnly: true })
  password: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatarUrl: string | null;

  @Column({ type: 'boolean', default: false })
  isEmailVerified: boolean;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.VIEWER,
  })
  role: Role;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIF,
  })
  statut: UserStatus;

  @Column({ type: 'enum', enum: AuthProvider, default: AuthProvider.LOCAL })
  authProvider: AuthProvider;

  @Column({ type: 'varchar', length: 255, nullable: true })
  refreshToken: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
