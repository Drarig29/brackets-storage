import { DataTypes, OmitId } from 'brackets-model';
import { ParticipantTransformer } from '../../transformers';
import { PrismaClient } from '@prisma/client';

export async function handleParticipantInsert(
    prisma: PrismaClient,
    values:
        | OmitId<DataTypes['participant']>
        | OmitId<DataTypes['participant']>[],
): Promise<number | boolean> {
    try {
        if (Array.isArray(values)) {
            await prisma.participant.createMany({
                data: values.map((p) => {
                    const value = ParticipantTransformer.to(p);
                    return { ...value, extra: value.extra ?? undefined };
                }),
            });

            return true;
        }

        const value = ParticipantTransformer.to(values);
        const participant = await prisma.participant.create({
            data: { ...value, extra: value.extra ?? undefined },
        });

        return participant.id;
    } catch {
        return Array.isArray(values) ? false : -1;
    }
}
