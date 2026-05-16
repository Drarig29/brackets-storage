import { OmitId } from 'brackets-model';
import { MatchResultTransformer, MatchTransformer } from '../../transformers';
import { Prisma, PrismaClient } from '@prisma/client';
import type { MatchWithExtra } from '../../types';
import { toPrismaId } from '../../prisma-id';

function getCreationData(
    value: OmitId<MatchWithExtra>,
): Prisma.XOR<Prisma.MatchCreateManyInput, Prisma.MatchUncheckedCreateInput> {
    return {
        ...MatchTransformer.to(value),
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

export async function handleMatchInsert(
    prisma: PrismaClient,
    values: OmitId<MatchWithExtra> | OmitId<MatchWithExtra>[],
): Promise<number | boolean> {
    try {
        if (Array.isArray(values)) {
            await prisma.match.createMany({
                data: values.map((v) => getCreationData(v)),
            });

            return true;
        }

        const match = await prisma.match.create({
            data: getCreationData(values),
        });

        return match.id;
    } catch {
        return Array.isArray(values) ? false : -1;
    }
}
