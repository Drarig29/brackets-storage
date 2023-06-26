import { DataTypes } from 'brackets-manager/dist/types';
import { PrismaClient } from '@prisma/client';

export async function handleGroupDelete(
    prisma: PrismaClient,
    filter?: Partial<DataTypes['group']>,
): Promise<boolean> {
    // No filter so delete everything
    if (!filter) {
        return prisma.group
            .deleteMany({})
            .then(() => true)
            .catch((e) => false);
    }

    return prisma.group
        .deleteMany({
            where: {
                id: filter.id,
                stageId: filter.stage_id,
                number: filter.number,
            },
        })
        .then(() => true)
        .catch((e) => false);
}
