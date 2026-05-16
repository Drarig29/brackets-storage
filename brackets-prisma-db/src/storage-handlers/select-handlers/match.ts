import { MatchStatusTransformer, MatchTransformer } from '../../transformers';
import { PrismaClient } from '@prisma/client';
import type { MatchWithExtra } from '../../types';
import type { Id } from 'brackets-model';
import { isModelId, toPrismaId } from '../../prisma-id';

export async function handleMatchSelect(
    prisma: PrismaClient,
    filter?: Partial<MatchWithExtra> | Id,
): Promise<MatchWithExtra[] | MatchWithExtra | null> {
    if (filter === undefined) {
        try {
            const values = await prisma.match.findMany({
                include: {
                    opponent1Result: true,
                    opponent2Result: true,
                },
                orderBy: [
                    {
                        round: {
                            number: 'asc',
                        },
                    },
                    { number: 'asc' },
                ],
            });

            return values.map(MatchTransformer.from);
        } catch {
            return [];
        }
    }

    if (isModelId(filter)) {
        // Find by Id
        try {
            const value = await prisma.match.findFirst({
                where: { id: toPrismaId(filter) },
                include: {
                    opponent1Result: true,
                    opponent2Result: true,
                },
            });

            if (value === null) {
                return null;
            }

            return MatchTransformer.from(value);
        } catch {
            return null;
        }
    }

    try {
        const values = await prisma.match.findMany({
            where: {
                id: toPrismaId(filter.id),
                stageId: toPrismaId(filter.stage_id),
                groupId: toPrismaId(filter.group_id),
                roundId: toPrismaId(filter.round_id),
                number: filter.number,
                status: filter.status
                    ? MatchStatusTransformer.to(filter.status)
                    : undefined,
                childCount: filter.child_count,
            },
            include: {
                opponent1Result: true,
                opponent2Result: true,
            },
            orderBy: [
                {
                    round: {
                        number: 'asc',
                    },
                },
                { number: 'asc' },
            ],
        });

        return values.map(MatchTransformer.from);
    } catch {
        return [];
    }
}
