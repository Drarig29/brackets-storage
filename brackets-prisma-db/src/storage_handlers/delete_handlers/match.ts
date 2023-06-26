import { DataTypes } from 'brackets-manager/dist/types';
import { MatchStatusTransformer } from '../../transformers';
import { PrismaClient } from '@prisma/client';

export async function handleMatchDelete(
    prisma: PrismaClient,
    filter?: Partial<DataTypes['match']>,
): Promise<boolean> {
    // No filter so delete everything
    if (!filter) {
        return prisma.match
            .deleteMany({})
            .then(() => true)
            .catch((e) => false);
    }

    return prisma.match
        .deleteMany({
            where: {
                id: filter.id,
                stageId: filter.stage_id,
                groupId: filter.group_id,
                roundId: filter.round_id,
                number: filter.number,
                status: filter.status
                    ? MatchStatusTransformer.to(filter.status)
                    : undefined,
            },
        })
        .then(() => true)
        .catch((e) => false);
}
