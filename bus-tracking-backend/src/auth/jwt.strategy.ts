import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, type JwtFromRequestFunction, type StrategyOptions } from 'passport-jwt';
import { UserRole } from '../database/enums/user-role.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const jwtFromRequest: JwtFromRequestFunction = (req) => {
      if (!req || typeof req !== 'object') return null;
      const headersUnknown = (req as { headers?: unknown }).headers;
      if (!headersUnknown || typeof headersUnknown !== 'object') return null;
      const headers = headersUnknown as Record<string, unknown>;
      const rawAuth = headers['authorization'];
      if (typeof rawAuth !== 'string') return null;
      const parts: string[] = rawAuth.split(' ');
      if (parts.length !== 2) return null;
      const [type, token]: [string, string] = [parts[0], parts[1]];
      if (typeof type !== 'string' || typeof token !== 'string') return null;
      if (type.toLowerCase() !== 'bearer') return null;
      return token;
    };
    const options: StrategyOptions = {
      jwtFromRequest,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dev_secret',
    };
    super(options);
  }

  validate(payload: { sub: string; email?: string; role?: UserRole }): {
    sub: string;
    email?: string;
    role?: UserRole;
  } {
    return { sub: payload.sub, email: payload.email, role: payload.role };
  }
}
