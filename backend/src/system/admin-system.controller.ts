import { Controller, Get, Put, UseGuards, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { SystemService } from './system.service';
import { UpdateStationDto } from './dto/update-station.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('api/admin/system')
export class AdminSystemController {
  constructor(private readonly system: SystemService) {}

  @Get('station')
  async getStation() {
    const station = await this.system.getMainStation();
    return { station, updatedAt: station.dateModification };
  }

  @Put('station')
  async updateStation(@Body() dto: UpdateStationDto) {
    const station = await this.system.upsertMainStation(dto);
    return { station, updatedAt: station.dateModification };
  }
}
