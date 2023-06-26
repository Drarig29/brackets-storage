import { DataTypes } from 'brackets-manager/dist/types';
import { StageTypeTransformer } from '../../transformers';
import { PrismaClient } from '@prisma/client';

export async function handleStageDelete(
    prisma: PrismaClient,
    filter?: Partial<DataTypes['stage']>,
): Promise<boolean> {
    // No filter so delete everything
    if (!filter) {
        return prisma.stage
            .deleteMany({})
            .then(() => true)
            .catch(() => false);
    }

    return prisma.stage
        .deleteMany({
            where: {
                id: filter.id,
                name: filter.name,
                number: filter.number,
                tournamentId: filter.tournament_id,
                type: filter.type
                    ? StageTypeTransformer.to(filter.type)
                    : undefined,
            },
        })
        .then(() => true)
        .catch(() => false);
}
