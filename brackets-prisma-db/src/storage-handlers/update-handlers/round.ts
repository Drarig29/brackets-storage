import { DataTypes, Id } from 'brackets-model';
import { PrismaClient } from '@prisma/client';
import { isModelId, toPrismaId } from '../../prisma-id';

export async function handleRoundUpdate(
    prisma: PrismaClient,
    filter: Partial<DataTypes['round']> | Id,
    value: Partial<DataTypes['round']> | DataTypes['round'],
): Promise<boolean> {
    if (isModelId(filter)) {
        // Update by Id
        try {
            await prisma.round.update({
                where: {
                    id: toPrismaId(filter),
                },
                data: {
                    number: value.number,
                    stageId: toPrismaId(value.stage_id),
                    groupId: toPrismaId(value.group_id),
                },
            });

            return true;
        } catch {
            return false;
        }
    }

    // Update by filter
    try {
        await prisma.round.updateMany({
            where: {
                id: toPrismaId(filter.id),
                number: filter.number,
                stageId: toPrismaId(filter.stage_id),
                groupId: toPrismaId(filter.group_id),
            },
            data: {
                number: value.number,
                stageId: toPrismaId(value.stage_id),
                groupId: toPrismaId(value.group_id),
            },
        });

        return true;
    } catch {
        return false;
    }
}
