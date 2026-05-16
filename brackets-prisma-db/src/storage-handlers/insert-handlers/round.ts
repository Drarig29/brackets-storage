import { DataTypes, OmitId } from 'brackets-model';
import { RoundTransformer } from '../../transformers';
import { PrismaClient } from '@prisma/client';

export async function handleRoundInsert(
    prisma: PrismaClient,
    values: OmitId<DataTypes['round']> | OmitId<DataTypes['round']>[],
): Promise<number | boolean> {
    try {
        if (Array.isArray(values)) {
            await prisma.round.createMany({
                data: values.map(RoundTransformer.to),
            });

            return true;
        }

        const round = await prisma.round.create({
            data: RoundTransformer.to(values),
        });

        return round.id;
    } catch {
        return Array.isArray(values) ? false : -1;
    }
}
