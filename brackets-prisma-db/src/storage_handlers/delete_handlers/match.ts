import { DataTypes } from 'brackets-manager/dist/types';
import { prisma } from '../../client';
import { MatchStatusTransformer } from '../../transformers';

export async function handleMatchDelete(
  filter?: Partial<DataTypes['match']>,
): Promise<boolean> {
  // No filter so delete everything
  if (!filter) {
    return prisma.match
      .deleteMany({})
      .then(() => true)
      .catch((e) => {
        console.error(e);
        return false;
      });
  }

  return prisma.match
    .deleteMany({
      where: {
        id: filter.id,
        stageId: filter.stage_id,
        groupId: filter.group_id,
        roundId: filter.round_id,
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
