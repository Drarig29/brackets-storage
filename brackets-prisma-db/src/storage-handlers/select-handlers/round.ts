import { DataTypes, Id } from 'brackets-model';
import { RoundTransformer } from '../../transformers';
import { PrismaClient } from '@prisma/client';
import { isModelId, toPrismaId } from '../../prisma-id';

export async function handleRoundSelect(
    prisma: PrismaClient,
    filter?: Partial<DataTypes['round']> | Id,
): Promise<DataTypes['round'][] | DataTypes['round'] | null> {
    if (filter === undefined) {
        // Query all entries of table
        try {
            const values = await prisma.round.findMany({
                orderBy: [{ number: 'asc' }],
            });

            return values.map(RoundTransformer.from);
        } catch {
            return [];
        }
    }

    if (isModelId(filter)) {
        // Find by Id
        try {
            const value = await prisma.round.findFirst({
                where: { id: toPrismaId(filter) },
            });

            if (value === null) {
                return null;
            }

            return RoundTransformer.from(value);
        } catch {
            return null;
        }
    }

    try {
        const values = await prisma.round.findMany({
            where: {
                id: toPrismaId(filter.id),
                stageId: toPrismaId(filter.stage_id),
                groupId: toPrismaId(filter.group_id),
                number: filter.number,
            },
            orderBy: [{ number: 'asc' }],
        });

        return values.map(RoundTransformer.from);
    } catch {
        return [];
    }
}
