import { PrismaClient } from '@prisma/client';
import { DataTypes } from 'brackets-model';
import { InvalidPrismaIdError, toPrismaId } from '../../prisma-id';

export async function handleParticipantDelete(
    prisma: PrismaClient,
    filter?: Partial<DataTypes['participant']>,
): Promise<boolean> {
    // No filter so delete everything
    if (!filter) {
        try {
            await prisma.participant.deleteMany({});

            return true;
        } catch {
            return false;
        }
    }

    try {
        const where = {
            id: toPrismaId(filter.id),
            name: filter.name,
            tournamentId: toPrismaId(filter.tournament_id),
        };

        await prisma.participant.deleteMany({ where });

        return true;
    } catch (error) {
        // An unsupported storage ID should behave like a filter that matched no rows.
        if (error instanceof InvalidPrismaIdError) {
            return true;
        }

        return false;
    }
}
