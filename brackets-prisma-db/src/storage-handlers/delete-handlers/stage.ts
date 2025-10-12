import { DataTypes } from 'brackets-manager/dist/types';
import { StageTypeTransformer } from '../../transformers';
import { PrismaClient } from '@prisma/client';

export async function handleStageDelete(
    prisma: PrismaClient,
    filter?: Partial<DataTypes['stage']>,
): Promise<boolean> {
    return prisma
        .$transaction(async (tx) => {
            // Build where clause if a filter is provided
            const where = filter
                ? {
                    id: filter.id,
                    name: filter.name,
                    number: filter.number,
                    tournamentId: filter.tournament_id,
                    type: filter.type
                        ? StageTypeTransformer.to(filter.type)
                        : undefined,
                }
                : undefined;

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
        })
        .then(() => true)
        .catch((e) => {
            console.error(new Error(`Error deleting stages with filter ${JSON.stringify(filter)}`, { cause: e }));
            return false;
        });
}
