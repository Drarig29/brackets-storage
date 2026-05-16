import { DataTypes, OmitId } from 'brackets-model';
import { StageTransformer, StageSettingsTransformer } from '../../transformers';
import { PrismaClient } from '@prisma/client';

export async function handleStageInsert(
    prisma: PrismaClient,
    values: OmitId<DataTypes['stage']> | OmitId<DataTypes['stage']>[],
): Promise<number | boolean> {
    try {
        if (Array.isArray(values)) {
            await prisma.stage.createMany({
                data: values.map((v) => ({
                    ...StageTransformer.to(v),
                    settings: {
                        create: {
                            ...StageSettingsTransformer.to(v.settings),
                        },
                    },
                })),
            });

            return true;
        }

        const stage = await prisma.stage.create({
            data: {
                ...StageTransformer.to(values),
                settings: {
                    create: {
                        ...StageSettingsTransformer.to(values.settings),
                    },
                },
            },
        });

        return stage.id;
    } catch {
        return Array.isArray(values) ? false : -1;
    }
}
