import { DataTypes } from 'brackets-manager/dist/types';
import { ParticipantTransformer } from '../../transformers';
import { PrismaClient } from '@prisma/client';

export async function handleParticipantSelect(
    prisma: PrismaClient,
    filter?: Partial<DataTypes['participant']> | number,
): Promise<DataTypes['participant'][] | DataTypes['participant'] | null> {
    if (filter === undefined) {
        // Query all entries of table
        return prisma.participant
            .findMany()
            .then((values) => values.map(ParticipantTransformer.from))
            .catch((e) => []);
    }

    if (typeof filter === 'number') {
        // Find by Id
        return prisma.participant
            .findFirst({
                where: { id: filter },
            })
            .then((value) => {
                if (value === null) {
                    return null;
                }

                return ParticipantTransformer.from(value);
            })
            .catch((e) => null);
    }

    return prisma.participant
        .findMany({
            where: {
                id: filter.id,
                name: filter.name,
                tournamentId: filter.tournament_id,
            },
        })
        .then((values) => values.map(ParticipantTransformer.from))
        .catch((e) => []);
}
