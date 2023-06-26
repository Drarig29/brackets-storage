import { DataTypes } from 'brackets-manager/dist/types';
import { prisma } from '../../client';
import { StageTypeTransformer } from '../../transformers';

export async function handleStageDelete(
  filter?: Partial<DataTypes['stage']>,
): Promise<boolean> {
  // No filter so delete everything
  if (!filter) {
    return prisma.stage
      .deleteMany({})
      .then(() => true)
      .catch((e) => {
        console.error(e);
        return false;
      });
  }

  return prisma.stage
    .deleteMany({
      where: {
        id: filter.id,
        name: filter.name,
        number: filter.number,
        tournamentId: filter.tournament_id,
        type: filter.type ? StageTypeTransformer.to(filter.type) : undefined,
      },
    })
    .then(() => true)
    .catch((e) => {
      console.error(e);
      return false;
    });
}
