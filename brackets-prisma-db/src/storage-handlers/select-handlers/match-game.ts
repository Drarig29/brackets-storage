import {
    MatchStatusTransformer,
    MatchGameTransformer,
} from '../../transformers';
import { PrismaClient } from '@prisma/client';
import type { MatchGameWithExtra } from '../../types';
import type { Id } from 'brackets-model';
import { isModelId, toPrismaId } from '../../prisma-id';

export async function handleMatchGameSelect(
    prisma: PrismaClient,
    filter?: Partial<MatchGameWithExtra> | Id,
): Promise<MatchGameWithExtra[] | MatchGameWithExtra | null> {
    if (filter === undefined) {
        try {
            const values = await prisma.matchGame.findMany({
                include: {
                    opponent1Result: true,
                    opponent2Result: true,
                },
                orderBy: [{ number: 'asc' }],
            });

            return values.map(MatchGameTransformer.from);
        } catch {
            return [];
        }
    }

    if (isModelId(filter)) {
        try {
            const value = await prisma.matchGame.findFirst({
                where: { id: toPrismaId(filter) },
                include: {
                    opponent1Result: true,
                    opponent2Result: true,
                },
            });

            if (value === null) {
                return null;
            }

            return MatchGameTransformer.from(value);
        } catch {
            return null;
        }
    }

    try {
        const values = await prisma.matchGame.findMany({
            where: {
                id: toPrismaId(filter.id),
                stageId: toPrismaId(filter.stage_id),
                matchId: toPrismaId(filter.parent_id),
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
        });

        return values.map(MatchGameTransformer.from);
    } catch {
        return [];
    }
}
