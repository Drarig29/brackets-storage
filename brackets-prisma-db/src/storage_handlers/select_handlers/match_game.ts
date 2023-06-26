import { DataTypes } from 'brackets-manager/dist/types';
import {
    MatchStatusTransformer,
    MatchGameTransformer,
} from '../../transformers';
import { PrismaClient } from '@prisma/client';

export async function handleMatchGameSelect(
    prisma: PrismaClient,
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
            .catch(() => []);
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
        })
        .then((values) => values.map(MatchGameTransformer.from))
        .catch(() => []);
}
