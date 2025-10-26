import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { compare as bcryptCompare, hash as bcryptHash } from 'bcrypt';
import { User } from '../database/entities/User.entity';
import { UserRole } from '../database/enums/user-role.enum';

type CompareFn = (data: string, encrypted: string) => Promise<boolean>;
type HashFn = (data: string, rounds: number) => Promise<string>;
const safeBcryptCompare: CompareFn = bcryptCompare as unknown as CompareFn;
const safeBcryptHash: HashFn = bcryptHash as unknown as HashFn;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwt: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.users.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid: boolean = await safeBcryptCompare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  private signAccessToken(user: User): string {
    const payload: { sub: string; email: string; role: UserRole } = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwt.sign(payload); // utilise secret et expiresIn du JwtModule
  }

  private signRefreshToken(user: User): string {
    const payload: { sub: string; type: 'refresh' } = {
      sub: user.id,
      type: 'refresh',
    };
    const expiresIn: number = Number(process.env.JWT_REFRESH_EXPIRES_IN) || 60 * 60 * 24 * 7;
    return this.jwt.sign(payload, {
      secret: process.env.JWT_SECRET || 'dev_secret',
      expiresIn,
    });
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.validateUser(email, password);
    const accessToken: string = this.signAccessToken(user);
    const refreshToken: string = this.signRefreshToken(user);
    return { accessToken, refreshToken };
  }

  async refreshToken(
    token: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    type RefreshPayload = { sub: string; type: 'refresh' };
    let decoded: RefreshPayload;

    try {
      decoded = await this.jwt.verifyAsync<RefreshPayload>(token, {
        secret: process.env.JWT_SECRET || 'dev_secret',
      });
    } catch {
      // ESLint safe: on ignore l’erreur et on throw UnauthorizedException
      throw new UnauthorizedException('Invalid token');
    }

    if (decoded.type !== 'refresh') throw new UnauthorizedException('Invalid token type');

    const user = await this.users.findOne({ where: { id: decoded.sub } });
    if (!user) throw new UnauthorizedException('User not found');

    const accessToken: string = this.signAccessToken(user);
    const refreshToken: string = this.signRefreshToken(user);
    return { accessToken, refreshToken };
  }

  async resetPassword(userId: string, newPassword: string): Promise<void> {
    const hashed: string = await safeBcryptHash(newPassword, 10);
    await this.users.update({ id: userId }, { password: hashed });
  }
}
