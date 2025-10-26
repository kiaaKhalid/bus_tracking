import { Controller, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { MovementService } from './movement.service';
import { CorrectPlaqueDto } from './dto/correct-plaque.dto';
import type { Request } from 'express';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('api/admin/movements')
export class AdminMovementController {
  constructor(private readonly movementService: MovementService) {}

  @Post(':movementId/correct-plaque')
  correct(
    @Param('movementId') movementId: string,
    @Body() dto: CorrectPlaqueDto,
    @Req() req: Request & { user?: { id: string } },
  ) {
    const userId = req.user?.id as string;
    return this.movementService.correctPlaque(
      movementId,
      dto.correctedPlaque,
      dto.reason,
      userId,
    );
  }
}
