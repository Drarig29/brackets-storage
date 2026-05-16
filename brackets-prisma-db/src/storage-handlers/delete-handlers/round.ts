import { DataTypes } from 'brackets-model';
import { PrismaClient } from '@prisma/client';
import { InvalidPrismaIdError, toPrismaId } from '../../prisma-id';

export async function handleRoundDelete(
    prisma: PrismaClient,
    filter?: Partial<DataTypes['round']>,
): Promise<boolean> {
    // No filter so delete everything
    if (!filter) {
        try {
            await prisma.round.deleteMany({});

            return true;
        } catch {
            return false;
        }
    }

    try {
        const where = {
            id: toPrismaId(filter.id),
            stageId: toPrismaId(filter.stage_id),
            groupId: toPrismaId(filter.group_id),
            number: filter.number,
        };

        await prisma.round.deleteMany({ where });

        return true;
    } catch (error) {
        // An unsupported storage ID should behave like a filter that matched no rows.
        if (error instanceof InvalidPrismaIdError) {
            return true;
        }

        return false;
    }
}
