import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../common/enums/role.enum';
import { User } from './entities/user.entity';
import { AuthProvider } from './entities/auth-provider.enum';
import { UserStatus } from './entities/user-status.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async findAllPaginated(page: number, pageSize: number) {
    const [users, total] = await this.usersRepo.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });
    return { users, total, page, pageSize };
  }

  async createUser(params: {
    email: string;
    password: string;
    name?: string;
    role?: Role;
  }): Promise<User> {
    const { email, password, name = '', role = Role.VIEWER } = params;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = this.usersRepo.create({
      email: email.toLowerCase(),
      name,
      password: passwordHash,
      role,
      statut: UserStatus.ACTIF,
    });
    return this.usersRepo.save(user);
  }

  async adminCreateUser(params: {
    name: string;
    email: string;
    role: Role;
    password?: string;
  }): Promise<User> {
    const { name, email, role, password } = params;
    let passwordHash: string | null = null;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(password, salt);
    }
    const user = this.usersRepo.create({
      name,
      email: email.toLowerCase(),
      role,
      password: passwordHash,
      statut: UserStatus.ACTIF,
      authProvider: AuthProvider.LOCAL,
    });
    return this.usersRepo.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email: email.toLowerCase() } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id } });
  }

  async adminUpdateUser(
    id: string,
    patch: Partial<Pick<User, 'name' | 'email' | 'role' | 'password'>>,
  ): Promise<User> {
    const updates: Partial<User> = {};
    if (patch.name !== undefined) updates.name = patch.name;
    if (patch.email !== undefined) updates.email = patch.email.toLowerCase();
    if (patch.role !== undefined) updates.role = patch.role;
    if (patch.password !== undefined) {
      if (typeof patch.password === 'string') {
        const salt = await bcrypt.genSalt(10);
        updates.password = await bcrypt.hash(patch.password, salt);
      } else if (patch.password === null) {
        // explicitly clear password
        updates.password = null;
      }
    }
    await this.usersRepo.update(id, updates);
    const updated = await this.findById(id);
    if (!updated) throw new Error('Utilisateur introuvable');
    return updated;
  }

  async adminDeleteUser(id: string): Promise<{ message: string }> {
    await this.usersRepo.delete(id);
    return { message: 'Utilisateur supprimé avec succès' };
  }

  async setRefreshToken(
    userId: string,
    hashedRt: string | null,
  ): Promise<void> {
    await this.usersRepo.update({ id: userId }, { refreshToken: hashedRt });
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    if (!user.password) return false;
    return bcrypt.compare(password, user.password);
  }

  async findOrCreateOAuthUser(params: {
    provider: AuthProvider;
    email: string;
    name?: string;
    avatarUrl?: string | null;
    emailVerified?: boolean;
  }): Promise<User> {
    const {
      provider,
      email,
      name = '',
      avatarUrl = null,
      emailVerified,
    } = params;
    const existing = await this.findByEmail(email);
    if (existing) {
      // Ensure provider is set and user active
      if (existing.authProvider !== provider) {
        existing.authProvider = provider;
      }
      if (typeof emailVerified === 'boolean') {
        existing.isEmailVerified = emailVerified;
      }
      if (!existing.name && name) existing.name = name;
      if (!existing.avatarUrl && avatarUrl) existing.avatarUrl = avatarUrl;
      existing.statut = UserStatus.ACTIF;
      return this.usersRepo.save(existing);
    }

    const user = this.usersRepo.create({
      email: email.toLowerCase(),
      name,
      avatarUrl,
      password: null,
      role: Role.VIEWER,
      isEmailVerified: Boolean(emailVerified),
      authProvider: provider,
      statut: UserStatus.ACTIF,
    });
    return this.usersRepo.save(user);
  }
}
