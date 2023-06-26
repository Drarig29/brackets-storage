import { DataTypes } from 'brackets-manager/dist/types';
import { PrismaClient } from '@prisma/client';

export async function handleRoundUpdate(
    prisma: PrismaClient,
    filter: Partial<DataTypes['round']> | number,
    value: Partial<DataTypes['round']> | DataTypes['round'],
): Promise<boolean> {
    if (typeof filter === 'number') {
        // Update by Id
        return prisma.round
            .update({
                where: {
                    id: filter,
                },
                data: {
                    number: value.number,
                    stageId: value.stage_id,
                    groupId: value.group_id,
                },
            })
            .then(() => true)
            .catch(() => false);
    }

    // Update by filter
    return prisma.round
        .updateMany({
            where: {
                id: filter.id,
                number: filter.number,
                stageId: filter.stage_id,
                groupId: filter.group_id,
            },
            data: {
                number: value.number,
                stageId: value.stage_id,
                groupId: value.group_id,
            },
        })
        .then(() => true)
        .catch(() => false);
}
