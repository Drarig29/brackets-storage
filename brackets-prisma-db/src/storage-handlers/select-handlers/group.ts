import { DataTypes, Id } from 'brackets-model';
import { GroupTransformer } from '../../transformers';
import { PrismaClient } from '@prisma/client';
import { isModelId, toPrismaId } from '../../prisma-id';

export async function handleGroupSelect(
    prisma: PrismaClient,
    filter?: Partial<DataTypes['group']> | Id,
): Promise<DataTypes['group'][] | DataTypes['group'] | null> {
    if (filter === undefined) {
        // Query all entries of table
        try {
            const values = await prisma.group.findMany({
                orderBy: [{ number: 'asc' }],
            });

            return values.map(GroupTransformer.from);
        } catch {
            return [];
        }
    }

    if (isModelId(filter)) {
        // Find by Id
        try {
            const value = await prisma.group.findFirst({
                where: { id: toPrismaId(filter) },
            });

            if (value === null) {
                return null;
            }

            return GroupTransformer.from(value);
        } catch {
            return null;
        }
    }

    try {
        const values = await prisma.group.findMany({
            where: {
                id: toPrismaId(filter.id),
                stageId: toPrismaId(filter.stage_id),
                number: filter.number,
            },
            orderBy: [{ number: 'asc' }],
        });

        return values.map(GroupTransformer.from);
    } catch {
        return [];
    }
}
