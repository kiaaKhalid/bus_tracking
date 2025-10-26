import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import type { Request } from 'express';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('api/admin/reports')
export class AdminReportsController {
  constructor(private readonly service: ReportService) {}

  @Post()
  create(
    @Body() dto: CreateReportDto,
    @Req() req: Request & { user?: { id: string } },
  ) {
    const userId = req.user?.id as string;
    return this.service.create(dto, userId);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get()
  list(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ) {
    return this.service.findAllPaginated(page, pageSize);
  }
}
