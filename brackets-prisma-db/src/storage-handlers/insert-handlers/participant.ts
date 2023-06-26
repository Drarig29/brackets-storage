import { DataTypes, OmitId } from 'brackets-manager/dist/types';
import { ParticipantTransformer } from '../../transformers';
import { PrismaClient } from '@prisma/client';

export function handleParticipantInsert(
    prisma: PrismaClient,
    values:
        | OmitId<DataTypes['participant']>
        | OmitId<DataTypes['participant']>[],
): Promise<number> | Promise<boolean> {
    if (Array.isArray(values)) {
        return prisma.participant
            .createMany({
                data: values.map(ParticipantTransformer.to),
            })
            .then(() => true)
            .catch(() => false);
    }

    return prisma.participant
        .create({
            data: ParticipantTransformer.to(values),
        })
        .then((v) => v.id)
        .catch(() => -1);
}
