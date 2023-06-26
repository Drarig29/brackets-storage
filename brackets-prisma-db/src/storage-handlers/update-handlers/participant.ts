import { DataTypes } from 'brackets-manager/dist/types';
import { PrismaClient } from '@prisma/client';

export async function handleParticipantUpdate(
    prisma: PrismaClient,
    filter: Partial<DataTypes['participant']> | number,
    value: Partial<DataTypes['participant']> | DataTypes['participant'],
): Promise<boolean> {
    if (typeof filter === 'number') {
        // Update by Id
        return prisma.participant
            .update({
                where: {
                    id: filter,
                },
                data: {
                    name: value.name,
                    tournamentId: value.tournament_id,
                },
            })
            .then(() => true)
            .catch(() => false);
    }

    // Update by filter
    return prisma.participant
        .updateMany({
            where: {
                id: filter.id,
                name: filter.name,
                tournamentId: filter.tournament_id,
            },
            data: {
                name: value.name,
                tournamentId: value.tournament_id,
            },
        })
        .then(() => true)
        .catch(() => false);
}
