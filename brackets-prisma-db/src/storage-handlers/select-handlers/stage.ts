import { DataTypes, Id } from 'brackets-model';
import * as Prisma from '@prisma/client';
import { StageTransformer, StageTypeTransformer } from '../../transformers';
import { PrismaClient } from '@prisma/client';
import { isModelId, toPrismaId } from '../../prisma-id';

export async function handleStageSelect(
    prisma: PrismaClient,
    filter?: Partial<DataTypes['stage']> | Id,
): Promise<DataTypes['stage'][] | DataTypes['stage'] | null> {
    if (filter === undefined) {
        // Query all entries of table
        try {
            const values = await prisma.stage.findMany({
                include: {
                    settings: true,
                },
                orderBy: [{ number: 'asc' }],
            });

            return values.map((value) => {
                if (value.settings === null) {
                    throw Error(
                        `Stage didn't have a Settings Relation attached.`,
                    );
                }

                return StageTransformer.from(
                    value as Prisma.Stage & {
                        settings: Prisma.StageSettings;
                    },
                );
            });
        } catch {
            return [];
        }
    }

    if (isModelId(filter)) {
        // Find by Id
        try {
            const value = await prisma.stage.findFirst({
                where: { id: toPrismaId(filter) },
                include: {
                    settings: true,
                },
            });

            if (value === null) {
                return null;
            }

            if (value.settings === null) {
                throw Error(
                    `Stage didn't have a Settings Relation attached.`,
                );
            }

            return StageTransformer.from(
                value as Prisma.Stage & {
                    settings: Prisma.StageSettings;
                },
            );
        } catch {
            return null;
        }
    }

    try {
        const values = await prisma.stage.findMany({
            where: {
                id: toPrismaId(filter.id),
                name: filter.name,
                tournamentId: toPrismaId(filter.tournament_id),
                number: filter.number,
                type: filter.type
                    ? StageTypeTransformer.to(filter.type)
                    : undefined,
            },
            include: {
                settings: true,
            },
            orderBy: [{ number: 'asc' }],
        });

        return values.map((value) => {
            if (value.settings === null) {
                throw Error(
                    `Stage didn't have a Settings Relation attached.`,
                );
            }

            return StageTransformer.from(
                value as Prisma.Stage & {
                    settings: Prisma.StageSettings;
                },
            );
        });
    } catch {
        return [];
    }
}
