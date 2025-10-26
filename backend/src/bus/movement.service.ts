import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovementBus } from './entities/movement-bus.entity';
import { PlaqueCorrection } from './entities/plaque-correction.entity';

@Injectable()
export class MovementService {
  constructor(
    @InjectRepository(MovementBus)
    private readonly movementRepo: Repository<MovementBus>,
    @InjectRepository(PlaqueCorrection)
    private readonly correctionRepo: Repository<PlaqueCorrection>,
  ) {}

  async correctPlaque(
    movementId: string,
    correctedPlaque: string,
    reason: string | undefined,
    userId: string,
  ) {
    const movement = await this.movementRepo.findOne({
      where: { id: movementId },
    });
    if (!movement) throw new NotFoundException('Mouvement introuvable');

    const correction = this.correctionRepo.create({
      movementId,
      plaqueOriginale: movement.plaqueDetectee,
      plaqueCorrigee: correctedPlaque,
      raison: reason,
      corrigeeParUserId: userId,
    });
    await this.correctionRepo.save(correction);

    movement.plaqueDetectee = correctedPlaque;
    await this.movementRepo.save(movement);

    return {
      message: 'Plaque corrigée avec succès',
      movement,
    };
  }
}
