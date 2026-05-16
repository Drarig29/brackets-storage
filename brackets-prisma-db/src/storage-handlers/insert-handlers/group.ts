import { DataTypes, OmitId } from 'brackets-model';
import { GroupTransformer } from '../../transformers';
import { PrismaClient } from '@prisma/client';

export async function handleGroupInsert(
    prisma: PrismaClient,
    values: OmitId<DataTypes['group']> | OmitId<DataTypes['group']>[],
): Promise<number | boolean> {
    try {
        if (Array.isArray(values)) {
            await prisma.group.createMany({
                data: values.map(GroupTransformer.to),
            });

            return true;
        }

        const group = await prisma.group.create({
            data: GroupTransformer.to(values),
        });

        return group.id;
    } catch {
        return Array.isArray(values) ? false : -1;
    }
}
