import {
    MatchStatusTransformer,
    MatchGameTransformer,
} from '../../transformers';
import { PrismaClient } from '@prisma/client';
import type { MatchGameWithExtra } from '../../types';

export async function handleMatchGameSelect(
    prisma: PrismaClient,
    filter?: Partial<MatchGameWithExtra> | number,
): Promise<MatchGameWithExtra[] | MatchGameWithExtra | null> {
    if (filter === undefined) {
        return prisma.matchGame
            .findMany({
                include: {
                    opponent1Result: true,
                    opponent2Result: true,
                },
                orderBy: [{ number: 'asc' }],
            })
            .then((values) => values.map(MatchGameTransformer.from))
            .catch(() => []);
    }

    if (typeof filter === 'number') {
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
            .catch(() => null);
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
            orderBy: [{ number: 'asc' }],
        })
        .then((values) => values.map(MatchGameTransformer.from))
        .catch(() => []);
}
