import { DataTypes, OmitId } from 'brackets-manager/dist/types';
import { prisma } from '../../client';
import { MatchResultTransformer, MatchTransformer } from '../../transformers';
import { Prisma } from '@prisma/client';

function getCreationData(
  value: OmitId<DataTypes['match']>,
): Prisma.XOR<Prisma.MatchCreateManyInput, Prisma.MatchUncheckedCreateInput> {
  return {
    ...MatchTransformer.to(value),
    opponent1Result: value.opponent1
      ? {
          create: {
            participantId: value.opponent1.id,
            forfeit: value.opponent1.forfeit,
            position: value.opponent1.position,
            score: value.opponent1.score,
            result: value.opponent1.result
              ? MatchResultTransformer.to(value.opponent1.result)
              : undefined,
          },
        }
      : undefined,
    opponent2Result: value.opponent2
      ? {
          create: {
            participantId: value.opponent2.id,
            forfeit: value.opponent2.forfeit,
            position: value.opponent2.position,
            score: value.opponent2.score,
            result: value.opponent2.result
              ? MatchResultTransformer.to(value.opponent2.result)
              : undefined,
          },
        }
      : undefined,
  };
}

export function handleMatchInsert(
  values: OmitId<DataTypes['match']> | OmitId<DataTypes['match']>[],
): Promise<number> | Promise<boolean> {
  if (Array.isArray(values)) {
    return prisma.match
      .createMany({
        data: values.map((v) => getCreationData(v)),
      })
      .then(() => true)
      .catch((e) => {
        console.error(e);
        return false;
      });
  }

  return prisma.match
    .create({
      data: getCreationData(values),
    })
    .then((v) => v.id)
    .catch((e) => {
      console.error(e);
      return -1;
    });
}
