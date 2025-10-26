import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report, ReportStatus } from './entities/report.entity';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly repo: Repository<Report>,
  ) {}

  async create(dto: CreateReportDto, userId: string) {
    const entity = this.repo.create({
      typeRapport: dto.typeRapport,
      dateDebut: new Date(dto.dateDebut),
      dateFin: new Date(dto.dateFin),
      statut: ReportStatus.EN_COURS,
      dateGeneration: new Date(),
      donneesJSON: {},
      createdBy: userId,
    });
    return this.repo.save(entity);
  }

  async findOne(id: string) {
    const rep = await this.repo.findOne({ where: { id } });
    if (!rep) throw new NotFoundException('Rapport introuvable');
    return rep;
  }

  async findAllPaginated(page: number, pageSize: number) {
    const [reports, total] = await this.repo.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });
    return { reports, total, page, pageSize };
  }
}
