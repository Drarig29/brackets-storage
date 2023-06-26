import { DataTypes } from 'brackets-manager/dist/types';
import { MatchStatusTransformer } from '../../transformers';
import { PrismaClient } from '@prisma/client';

export async function handleMatchGameDelete(
    prisma: PrismaClient,
    filter?: Partial<DataTypes['match_game']>,
): Promise<boolean> {
    // No filter so delete everything
    if (!filter) {
        return prisma.matchGame
            .deleteMany({})
            .then(() => true)
            .catch((e) => false);
    }

    return prisma.matchGame
        .deleteMany({
            where: {
                id: filter.id,
                stageId: filter.stage_id,
                matchId: filter.parent_id,
                number: filter.number,
                status: filter.status
                    ? MatchStatusTransformer.to(filter.status)
                    : undefined,
            },
        })
        .then(() => true)
        .catch((e) => false);
}
