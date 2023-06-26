import { DataTypes } from 'brackets-manager/dist/types';
import {
    handleGroupDelete,
    handleMatchDelete,
    handleMatchGameDelete,
    handleParticipantDelete,
    handleRoundDelete,
    handleStageDelete,
} from './delete_handlers';
import { PrismaClient } from '@prisma/client';

// Can't be named `delete` because its a reserved word...
export async function handleDelete<T extends keyof DataTypes>(
    prisma: PrismaClient,
    table: T,
    filter?: Partial<DataTypes[T]>,
): Promise<boolean> {
    switch (table) {
        case 'participant':
            return handleParticipantDelete(prisma, filter);

        case 'stage':
            return handleStageDelete(prisma, filter);

        case 'group':
            return handleGroupDelete(prisma, filter);

        case 'round':
            return handleRoundDelete(prisma, filter);

        case 'match':
            return handleMatchDelete(prisma, filter);

        case 'match_game':
            return handleMatchGameDelete(prisma, filter);

        default:
            return false;
    }
}
