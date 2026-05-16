import { DataTypes, Id } from 'brackets-model';
import { ParticipantTransformer } from '../../transformers';
import { PrismaClient } from '@prisma/client';
import { isModelId, toPrismaId } from '../../prisma-id';

export async function handleParticipantSelect(
    prisma: PrismaClient,
    filter?: Partial<DataTypes['participant']> | Id,
): Promise<DataTypes['participant'][] | DataTypes['participant'] | null> {
    if (filter === undefined) {
        // Query all entries of table
        try {
            const values = await prisma.participant.findMany();

            return values.map(ParticipantTransformer.from);
        } catch {
            return [];
        }
    }

    if (isModelId(filter)) {
        // Find by Id
        try {
            const value = await prisma.participant.findFirst({
                where: { id: toPrismaId(filter) },
            });

            if (value === null) {
                return null;
            }

            return ParticipantTransformer.from(value);
        } catch {
            return null;
        }
    }

    try {
        const values = await prisma.participant.findMany({
            where: {
                id: toPrismaId(filter.id),
                name: filter.name,
                tournamentId: toPrismaId(filter.tournament_id),
            },
        });

        return values.map(ParticipantTransformer.from);
    } catch {
        return [];
    }
}
