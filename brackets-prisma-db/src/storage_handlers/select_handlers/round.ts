import { DataTypes } from 'brackets-manager/dist/types';
import { prisma } from '../../client';
import { RoundTransformer } from '../../transformers';

export async function handleRoundSelect(
  filter?: Partial<DataTypes['round']> | number,
): Promise<DataTypes['round'][] | DataTypes['round'] | null> {
  if (filter === undefined) {
    // Query all entries of table
    return prisma.round
      .findMany()
      .then((values) => values.map(RoundTransformer.from))
      .catch((e) => {
        console.error(e);
        return [];
      });
  }

  if (typeof filter === 'number') {
    // Find by Id
    return prisma.round
      .findFirst({
        where: { id: filter },
      })
      .then((value) => {
        if (value === null) {
          return null;
        }

        return RoundTransformer.from(value);
      })
      .catch((e) => {
        console.error(e);
        return null;
      });
  }

  return prisma.round
    .findMany({
      where: {
        id: filter.id,
        stageId: filter.stage_id,
        groupId: filter.group_id,
        number: filter.number,
      },
    })
    .then((values) => values.map(RoundTransformer.from))
    .catch((e) => {
      console.error(e);
      return [];
    });
}
