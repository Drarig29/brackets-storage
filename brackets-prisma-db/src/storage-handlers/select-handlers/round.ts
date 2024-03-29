import { DataTypes } from 'brackets-manager/dist/types';
import { RoundTransformer } from '../../transformers';
import { PrismaClient } from '@prisma/client';

export async function handleRoundSelect(
    prisma: PrismaClient,
    filter?: Partial<DataTypes['round']> | number,
): Promise<DataTypes['round'][] | DataTypes['round'] | null> {
    if (filter === undefined) {
        // Query all entries of table
        return prisma.round
            .findMany({
                orderBy: [{ number: 'asc' }],
            })
            .then((values) => values.map(RoundTransformer.from))
            .catch(() => []);
    }

    if (typeof filter === 'number') {
        // Find by Id
        return prisma.round
            .findFirst({
                where: { id: filter },
            })
            .then((value) => {
                if (value === null) {
                    return null;
                }

                return RoundTransformer.from(value);
            })
            .catch(() => null);
    }

    return prisma.round
        .findMany({
            where: {
                id: filter.id,
                stageId: filter.stage_id,
                groupId: filter.group_id,
                number: filter.number,
            },
            orderBy: [{ number: 'asc' }],
        })
        .then((values) => values.map(RoundTransformer.from))
        .catch(() => []);
}
