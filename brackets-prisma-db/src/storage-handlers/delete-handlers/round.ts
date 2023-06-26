import { DataTypes } from 'brackets-manager/dist/types';
import { PrismaClient } from '@prisma/client';

export async function handleRoundDelete(
    prisma: PrismaClient,
    filter?: Partial<DataTypes['round']>,
): Promise<boolean> {
    // No filter so delete everything
    if (!filter) {
        return prisma.round
            .deleteMany({})
            .then(() => true)
            .catch(() => false);
    }

    return prisma.round
        .deleteMany({
            where: {
                id: filter.id,
                stageId: filter.stage_id,
                groupId: filter.group_id,
                number: filter.number,
            },
        })
        .then(() => true)
        .catch(() => false);
}
