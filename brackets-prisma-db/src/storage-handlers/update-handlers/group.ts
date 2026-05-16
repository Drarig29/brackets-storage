import { DataTypes, Id } from 'brackets-model';
import { PrismaClient } from '@prisma/client';
import { isModelId, toPrismaId } from '../../prisma-id';

export async function handleGroupUpdate(
    prisma: PrismaClient,
    filter: Partial<DataTypes['group']> | Id,
    value: Partial<DataTypes['group']> | DataTypes['group'],
): Promise<boolean> {
    if (isModelId(filter)) {
        // Update by Id
        try {
            await prisma.group.update({
                where: {
                    id: toPrismaId(filter),
                },
                data: {
                    number: value.number,
                    stageId: toPrismaId(value.stage_id),
                },
            });

            return true;
        } catch {
            return false;
        }
    }

    // Update by filter
    try {
        await prisma.group.updateMany({
            where: {
                id: toPrismaId(filter.id),
                number: filter.number,
                stageId: toPrismaId(filter.stage_id),
            },
            data: {
                number: value.number,
                stageId: toPrismaId(value.stage_id),
            },
        });

        return true;
    } catch {
        return false;
    }
}
