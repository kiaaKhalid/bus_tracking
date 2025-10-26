import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Station } from '../station/entities/station.entity';
import { UpdateStationDto } from './dto/update-station.dto';

@Injectable()
export class SystemService {
  constructor(
    @InjectRepository(Station)
    private readonly stationRepo: Repository<Station>,
  ) {}

  async getMainStation() {
    const station = await this.stationRepo.findOne({
      order: { dateCreation: 'ASC' },
    });
    if (!station) throw new NotFoundException('Aucune station trouvée');
    return station;
  }

  async upsertMainStation(dto: UpdateStationDto) {
    let station = await this.stationRepo.findOne({
      order: { dateCreation: 'ASC' },
    });
    if (!station) {
      station = this.stationRepo.create({ ...dto });
    } else {
      this.stationRepo.merge(station, dto);
    }
    const saved = await this.stationRepo.save(station);
    return saved;
  }
}
