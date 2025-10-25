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
                data: values.map(p => {
                    const value = ParticipantTransformer.to(p);
                    return { ...value, extra: value.extra ?? undefined };
                }),
            })
            .then(() => true)
            .catch(() => false);
    }

    const value = ParticipantTransformer.to(values);
    return prisma.participant
        .create({
            data: { ...value, extra: value.extra ?? undefined },
        })
        .then((v) => v.id)
        .catch(() => -1);
}
