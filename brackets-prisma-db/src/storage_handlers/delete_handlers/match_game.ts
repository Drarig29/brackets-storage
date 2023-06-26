import { DataTypes } from 'brackets-manager/dist/types';
import { prisma } from '../../client';
import { MatchStatusTransformer } from '../../transformers';

export async function handleMatchGameDelete(
  filter?: Partial<DataTypes['match_game']>,
): Promise<boolean> {
  // No filter so delete everything
  if (!filter) {
    return prisma.matchGame
      .deleteMany({})
      .then(() => true)
      .catch((e) => {
        console.error(e);
        return false;
      });
  }

  return prisma.matchGame
    .deleteMany({
      where: {
        id: filter.id,
        stageId: filter.stage_id,
        matchId: filter.parent_id,
        number: filter.number,
        status: filter.status
          ? MatchStatusTransformer.to(filter.status)
          : undefined,
      },
    })
    .then(() => true)
    .catch((e) => {
      console.error(e);
      return false;
    });
}
