import { DataTypes } from 'brackets-model';
import { StageTypeTransformer } from '../../transformers';
import { PrismaClient } from '@prisma/client';
import { InvalidPrismaIdError, toPrismaId } from '../../prisma-id';

export async function handleStageDelete(
    prisma: PrismaClient,
    filter?: Partial<DataTypes['stage']>,
): Promise<boolean> {
    try {
        const where = filter
            ? {
                  id: toPrismaId(filter.id),
                  name: filter.name,
                  number: filter.number,
                  tournamentId: toPrismaId(filter.tournament_id),
                  type: filter.type
                      ? StageTypeTransformer.to(filter.type)
                      : undefined,
            }
            : undefined;

        await prisma.$transaction(async (tx) => {
            if (!where) {
                // No filter: delete in the right order to satisfy FK constraints
                await tx.stageSettings.deleteMany({});
                await tx.stage.deleteMany({});
                return true;
            }

            // Filtered delete: find matching stages
            const stages = await tx.stage.findMany({
                where,
                select: { id: true },
            });

            if (stages.length === 0) return true;

            // Delete related StageSettings first to satisfy FK constraints
            await tx.stageSettings.deleteMany({
                where: { stageId: { in: stages.map((s) => s.id) } },
            });

            // Then delete the stages
            await tx.stage.deleteMany({ where });
            return true;
        });

        return true;
    } catch (error) {
        // An unsupported storage ID should behave like a filter that matched no rows.
        if (error instanceof InvalidPrismaIdError) {
            return true;
        }

        return false;
    }
}
