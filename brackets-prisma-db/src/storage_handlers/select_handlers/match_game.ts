import { DataTypes } from 'brackets-manager/dist/types';
import { prisma } from '../../client';
import {
  MatchStatusTransformer,
  MatchGameTransformer,
} from '../../transformers';

export async function handleMatchGameSelect(
  filter?: Partial<DataTypes['match_game']> | number,
): Promise<DataTypes['match_game'][] | DataTypes['match_game'] | null> {
  if (filter === undefined) {
    // Query all entries of table
    return prisma.matchGame
      .findMany({
        include: {
          opponent1Result: true,
          opponent2Result: true,
        },
      })
      .then((values) => values.map(MatchGameTransformer.from))
      .catch((e) => {
        console.error(e);
        return [];
      });
  }

  if (typeof filter === 'number') {
    // Find by Id
    return prisma.matchGame
      .findFirst({
        where: { id: filter },
        include: {
          opponent1Result: true,
          opponent2Result: true,
        },
      })
      .then((value) => {
        if (value === null) {
          return null;
        }

        return MatchGameTransformer.from(value);
      })
      .catch((e) => {
        console.error(e);
        return null;
      });
  }

  return prisma.matchGame
    .findMany({
      where: {
        id: filter.id,
        stageId: filter.stage_id,
        matchId: filter.parent_id,
        number: filter.number,
        status: filter.status
          ? MatchStatusTransformer.to(filter.status)
          : undefined,
      },
      include: {
        opponent1Result: true,
        opponent2Result: true,
      },
    })
    .then((values) => values.map(MatchGameTransformer.from))
    .catch((e) => {
      console.error(e);
      return [];
    });
}
