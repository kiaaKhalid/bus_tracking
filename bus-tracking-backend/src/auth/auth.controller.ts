import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Request } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password }: { email: string; password: string } = dto;
    return this.auth.login(email, password);
  }

  @Post('refresh-token')
  async refresh(
    @Body() dto: RefreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.auth.refreshToken(dto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(
    @Req()
    req: Request & { user: { sub: string; email?: string; role?: unknown } },
  ): { sub: string; email?: string; role?: unknown } {
    return req.user;
  }
}
