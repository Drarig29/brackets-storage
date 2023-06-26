import { DataTypes, OmitId } from 'brackets-manager/dist/types';
import {
    StageTransformer,
    StageSettingsTransformer,
} from '../../transformers/';
import { PrismaClient } from '@prisma/client';

export function handleStageInsert(
    prisma: PrismaClient,
    values: OmitId<DataTypes['stage']> | OmitId<DataTypes['stage']>[],
): Promise<number> | Promise<boolean> {
    if (Array.isArray(values)) {
        return prisma.stage
            .createMany({
                data: values.map((v) => ({
                    ...StageTransformer.to(v),
                    settings: {
                        create: {
                            ...StageSettingsTransformer.to(v.settings),
                        },
                    },
                })),
            })
            .then(() => true)
            .catch(() => false);
    }

    return prisma.stage
        .create({
            data: {
                ...StageTransformer.to(values),
                settings: {
                    create: {
                        ...StageSettingsTransformer.to(values.settings),
                    },
                },
            },
        })
        .then((v) => v.id)
        .catch(() => -1);
}
