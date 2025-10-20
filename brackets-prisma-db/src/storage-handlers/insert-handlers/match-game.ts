import { DataTypes, OmitId } from 'brackets-manager/dist/types';
import {
    MatchGameTransformer,
    MatchResultTransformer,
} from '../../transformers';
import { Prisma, PrismaClient } from '@prisma/client';

type MatchGameWithExtra = DataTypes['match_game'] & { extra?: Prisma.JsonValue | null };

function getCreationData(
    value: OmitId<MatchGameWithExtra>,
): Prisma.XOR<
    Prisma.MatchGameCreateManyInput,
    Prisma.MatchGameUncheckedCreateInput
> {
    return {
        ...MatchGameTransformer.to(value),
        extra: value.extra ?? undefined,
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

export function handleMatchGameInsert(
    prisma: PrismaClient,
    values: OmitId<MatchGameWithExtra> | OmitId<MatchGameWithExtra>[],
): Promise<number> | Promise<boolean> {
    if (Array.isArray(values)) {
        return prisma.matchGame
            .createMany({
                data: values.map((v) => getCreationData(v)),
            })
            .then(() => true)
            .catch(() => false);
    }

    return prisma.matchGame
        .create({
            data: getCreationData(values),
        })
        .then((v) => v.id)
        .catch(() => -1);
}
