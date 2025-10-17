import { DataTypes } from 'brackets-manager/dist/types';
import { MatchStatusTransformer, MatchTransformer } from '../../transformers';
import { Prisma, PrismaClient } from '@prisma/client';

type MatchWithExtra = DataTypes['match'] & { extra?: Prisma.JsonValue | null };

export async function handleMatchSelect(
    prisma: PrismaClient,
    filter?: Partial<MatchWithExtra> | number,
): Promise<MatchWithExtra[] | MatchWithExtra | null> {
    if (filter === undefined) {
        // Query all entries of table
        return prisma.match
            .findMany({
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
            })
            .then((values) => values.map(MatchTransformer.from))
            .catch(() => []);
    }

    if (typeof filter === 'number') {
        // Find by Id
        return prisma.match
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

                return MatchTransformer.from(value);
            })
            .catch(() => null);
    }

    return prisma.match
        .findMany({
            where: {
                id: filter.id,
                stageId: filter.stage_id,
                groupId: filter.group_id,
                roundId: filter.round_id,
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
        })
        .then((values) => values.map(MatchTransformer.from))
        .catch(() => []);
}
