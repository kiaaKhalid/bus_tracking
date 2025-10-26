import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bus } from './entities/bus.entity';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';

@Injectable()
export class BusService {
  constructor(@InjectRepository(Bus) private readonly repo: Repository<Bus>) {}

  async findAllPaginated(page: number, pageSize: number) {
    const [buses, total] = await this.repo.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { dateCreation: 'DESC' },
    });
    return { buses, total, page, pageSize };
    
  }

  async create(dto: CreateBusDto) {
    const entity = this.repo.create({
      ...dto,
      dateAcquisition: dto.dateAcquisition ? new Date(dto.dateAcquisition) : undefined,
      derniereRevision: dto.derniereRevision ? new Date(dto.derniereRevision) : undefined,
    });
    return this.repo.save(entity);
  }

  async findOne(id: string) {
    const bus = await this.repo.findOne({ where: { id } });
    if (!bus) throw new NotFoundException();
    return bus;
  }

  async update(id: string, dto: UpdateBusDto) {
    const existing = await this.findOne(id);
    const patched: Partial<Bus> = {
      ...dto,
      dateAcquisition: dto.dateAcquisition !== undefined ? (dto.dateAcquisition ? new Date(dto.dateAcquisition) : undefined) : existing.dateAcquisition,
      derniereRevision: dto.derniereRevision !== undefined ? (dto.derniereRevision ? new Date(dto.derniereRevision) : undefined) : existing.derniereRevision,
    } as any;
    await this.repo.update(id, patched);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.repo.delete(id);
    return { message: 'Bus supprimé avec succès' };
  }
}
