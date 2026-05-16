import { DataTypes } from 'brackets-model';
import { MatchStatusTransformer } from '../../transformers';
import { PrismaClient } from '@prisma/client';
import { InvalidPrismaIdError, toPrismaId } from '../../prisma-id';

export async function handleMatchGameDelete(
    prisma: PrismaClient,
    filter?: Partial<DataTypes['match_game']>,
): Promise<boolean> {
    // No filter so delete everything
    if (!filter) {
        try {
            await prisma.matchGame.deleteMany({});

            return true;
        } catch {
            return false;
        }
    }

    try {
        const where = {
            id: toPrismaId(filter.id),
            stageId: toPrismaId(filter.stage_id),
            matchId: toPrismaId(filter.parent_id),
            number: filter.number,
            status: filter.status
                ? MatchStatusTransformer.to(filter.status)
                : undefined,
        };

        await prisma.matchGame.deleteMany({ where });

        return true;
    } catch (error) {
        // An unsupported storage ID should behave like a filter that matched no rows.
        if (error instanceof InvalidPrismaIdError) {
            return true;
        }

        return false;
    }
}
