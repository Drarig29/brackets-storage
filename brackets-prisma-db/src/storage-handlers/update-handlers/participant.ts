import { DataTypes, Id } from 'brackets-model';
import { PrismaClient } from '@prisma/client';
import { participantExtraFromInput } from '../../transformers';
import { isModelId, toPrismaId } from '../../prisma-id';

export async function handleParticipantUpdate(
    prisma: PrismaClient,
    filter: Partial<DataTypes['participant']> | Id,
    value: Partial<DataTypes['participant']> | DataTypes['participant'],
): Promise<boolean> {
    if (isModelId(filter)) {
        // Update by Id
        try {
            await prisma.participant.update({
                where: {
                    id: toPrismaId(filter),
                },
                data: {
                    name: value.name,
                    tournamentId: toPrismaId(value.tournament_id),
                    extra:
                        participantExtraFromInput(
                            value as Partial<DataTypes['participant']> &
                                Record<string, unknown>,
                        ) ?? undefined,
                },
            });

            return true;
        } catch {
            return false;
        }
    }

    // Update by filter
    try {
        await prisma.participant.updateMany({
            where: {
                id: toPrismaId(filter.id),
                name: filter.name,
                tournamentId: toPrismaId(filter.tournament_id),
            },
            data: {
                name: value.name,
                tournamentId: toPrismaId(value.tournament_id),
                extra:
                    participantExtraFromInput(
                        value as Partial<DataTypes['participant']> &
                            Record<string, unknown>,
                    ) ?? undefined,
            },
        });

        return true;
    } catch {
        return false;
    }
}
