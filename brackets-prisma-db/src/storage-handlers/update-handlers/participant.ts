import { DataTypes } from 'brackets-manager/dist/types';
import { PrismaClient } from '@prisma/client';
import { participantExtraFromInput } from '../../transformers';

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
                    extra: participantExtraFromInput(
                        value as Partial<DataTypes['participant']> & Record<string, unknown>,
                    ) ?? undefined,
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
                extra: participantExtraFromInput(
                    value as Partial<DataTypes['participant']> & Record<string, unknown>,
                ) ?? undefined,
            },
        })
        .then(() => true)
        .catch(() => false);
}
