import { DataTypes } from 'brackets-manager/dist/types';
import * as Prisma from '@prisma/client';
import { StageTransformer, StageTypeTransformer } from '../../transformers';
import { PrismaClient } from '@prisma/client';

export async function handleStageSelect(
    prisma: PrismaClient,
    filter?: Partial<DataTypes['stage']> | number,
): Promise<DataTypes['stage'][] | DataTypes['stage'] | null> {
    if (filter === undefined) {
        // Query all entries of table
        return prisma.stage
            .findMany({
                include: {
                    settings: true,
                },
            })
            .then((values) =>
                values.map((value) => {
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
                }),
            )
            .catch((e) => {
                console.error(e);
                return [];
            });
    }

    if (typeof filter === 'number') {
        // Find by Id
        return prisma.stage
            .findFirst({
                where: { id: filter },
                include: {
                    settings: true,
                },
            })
            .then((value) => {
                if (value === null) {
                    return null;
                }

                if (value.settings === null) {
                    throw Error(
                        `Stage didn't have a Settings Relation attached.`,
                    );
                }

                return StageTransformer.from(
                    value as Prisma.Stage & { settings: Prisma.StageSettings },
                );
            })
            .catch((e) => {
                console.error(e);
                return null;
            });
    }

    return prisma.stage
        .findMany({
            where: {
                id: filter.id,
                name: filter.name,
                tournamentId: filter.tournament_id,
                number: filter.number,
                type: filter.type
                    ? StageTypeTransformer.to(filter.type)
                    : undefined,
            },
            include: {
                settings: true,
            },
        })
        .then((values) =>
            values.map((value) => {
                if (value.settings === null) {
                    throw Error(
                        `Stage didn't have a Settings Relation attached.`,
                    );
                }

                return StageTransformer.from(
                    value as Prisma.Stage & { settings: Prisma.StageSettings },
                );
            }),
        )
        .catch((e) => {
            console.error(e);
            return [];
        });
}
