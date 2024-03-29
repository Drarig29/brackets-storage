import { DataTypes, OmitId } from 'brackets-manager/dist/types';
import { GroupTransformer } from '../../transformers';
import { PrismaClient } from '@prisma/client';

export function handleGroupInsert(
    prisma: PrismaClient,
    values: OmitId<DataTypes['group']> | OmitId<DataTypes['group']>[],
): Promise<number> | Promise<boolean> {
    if (Array.isArray(values)) {
        return prisma.group
            .createMany({
                data: values.map(GroupTransformer.to),
            })
            .then(() => true)
            .catch(() => false);
    }

    return prisma.group
        .create({
            data: GroupTransformer.to(values),
        })
        .then((v) => v.id)
        .catch(() => -1);
}
