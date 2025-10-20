import { DataTypes } from 'brackets-manager/dist/types';
// @ts-ignore
import { GroupTransformer } from "../../transformers";
import { PrismaClient } from '@prisma/client';

export async function handleGroupSelect(
    prisma: PrismaClient,
    filter?: Partial<DataTypes['group']> | number,
): Promise<DataTypes['group'][] | DataTypes['group'] | null> {
    if (filter === undefined) {
        // Query all entries of table
        return prisma.group
            .findMany({
                orderBy: [{ number: 'asc' }],
            })
            .then((values) => values.map(GroupTransformer.from))
            .catch(() => []);
    }

    if (typeof filter === 'number') {
        // Find by Id
        return prisma.group
            .findFirst({
                where: { id: filter },
            })
            .then((value) => {
                if (value === null) {
                    return null;
                }

                return GroupTransformer.from(value);
            })
            .catch(() => null);
    }

    return prisma.group
        .findMany({
            where: {
                id: filter.id,
                stageId: filter.stage_id,
                number: filter.number,
            },
            orderBy: [{ number: 'asc' }],
        })
        .then((values) => values.map(GroupTransformer.from))
        .catch(() => []);
}
