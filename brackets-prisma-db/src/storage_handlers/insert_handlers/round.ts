import { DataTypes, OmitId } from 'brackets-manager/dist/types';
import { RoundTransformer } from '../../transformers';
import { PrismaClient } from '@prisma/client';

export function handleRoundInsert(
    prisma: PrismaClient,
    values: OmitId<DataTypes['round']> | OmitId<DataTypes['round']>[],
): Promise<number> | Promise<boolean> {
    if (Array.isArray(values)) {
        return prisma.round
            .createMany({
                data: values.map(RoundTransformer.to),
            })
            .then(() => true)
            .catch((e) => false);
    }

    return prisma.round
        .create({
            data: RoundTransformer.to(values),
        })
        .then((v) => v.id)
        .catch((e) => -1);
}
