import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { UsersService } from './users.service';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { User } from './entities/user.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('api/admin/users')
export class AdminUsersController {
  constructor(private readonly users: UsersService) {}

  private sanitizeUser(u: User): Omit<User, 'password' | 'refreshToken'> {
    const safe = {
      id: u.id,
      name: u.name,
      email: u.email,
      avatarUrl: u.avatarUrl,
      isEmailVerified: u.isEmailVerified,
      role: u.role,
      statut: u.statut,
      authProvider: u.authProvider,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    } satisfies Omit<User, 'password' | 'refreshToken'>;
    return safe;
  }

  @Get()
  async list(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ) {
    const result = await this.users.findAllPaginated(page, pageSize);
    const users = result.users.map((u) => this.sanitizeUser(u));
    return { users, total: result.total, page, pageSize };
  }

  @Post()
  async create(@Body() dto: AdminCreateUserDto) {
    const created = await this.users.adminCreateUser(dto);
    return this.sanitizeUser(created);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: AdminUpdateUserDto) {
    const updated = await this.users.adminUpdateUser(id, dto);
    return this.sanitizeUser(updated);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.users.adminDeleteUser(id);
  }
}
