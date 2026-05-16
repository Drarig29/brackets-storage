import { OmitId } from 'brackets-model';
import {
    MatchGameTransformer,
    MatchResultTransformer,
} from '../../transformers';
import { Prisma, PrismaClient } from '@prisma/client';
import type { MatchGameWithExtra } from '../../types';
import { toPrismaId } from '../../prisma-id';

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
                    participantId: toPrismaId(value.opponent1.id),
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
                    participantId: toPrismaId(value.opponent2.id),
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

export async function handleMatchGameInsert(
    prisma: PrismaClient,
    values: OmitId<MatchGameWithExtra> | OmitId<MatchGameWithExtra>[],
): Promise<number | boolean> {
    try {
        if (Array.isArray(values)) {
            await prisma.matchGame.createMany({
                data: values.map((v) => getCreationData(v)),
            });

            return true;
        }

        const matchGame = await prisma.matchGame.create({
            data: getCreationData(values),
        });

        return matchGame.id;
    } catch {
        return Array.isArray(values) ? false : -1;
    }
}
