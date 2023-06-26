import { PrismaClient } from '@prisma/client';
import { DataTypes } from 'brackets-manager/dist/types';

export async function handleParticipantDelete(
    prisma: PrismaClient,
    filter?: Partial<DataTypes['participant']>,
): Promise<boolean> {
    // No filter so delete everything
    if (!filter) {
        return prisma.participant
            .deleteMany({})
            .then(() => true)
            .catch((e) => false);
    }

    return prisma.participant
        .deleteMany({
            where: {
                id: filter.id,
                name: filter.name,
                tournamentId: filter.tournament_id,
            },
        })
        .then(() => true)
        .catch((e) => false);
}
