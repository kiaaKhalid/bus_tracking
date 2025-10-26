import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly repo: Repository<Schedule>,
  ) {}

  async findAllPaginated(page: number, pageSize: number) {
    const [schedules, total] = await this.repo.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { dateCreation: 'DESC' },
    });
    return { schedules, total, page, pageSize };
  }

  async create(dto: CreateScheduleDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async findOne(id: string) {
    const schedule = await this.repo.findOne({ where: { id } });
    if (!schedule) throw new NotFoundException();
    return schedule;
  }

  async update(id: string, dto: UpdateScheduleDto) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.repo.delete(id);
    return { message: 'Horaire supprimé avec succès' };
  }
}
