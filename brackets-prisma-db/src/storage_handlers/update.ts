import { DataTypes } from 'brackets-manager/dist/types';
import {
    handleGroupUpdate,
    handleMatchGameUpdate,
    handleMatchUpdate,
    handleParticipantUpdate,
    handleRoundUpdate,
    handleStageUpdate,
} from './update_handlers';
import { PrismaClient } from '@prisma/client';

export async function handleUpdate<T extends keyof DataTypes>(
    prisma: PrismaClient,
    table: T,
    filter: Partial<DataTypes[T]> | number,
    value: Partial<DataTypes[T]> | DataTypes[T],
): Promise<boolean> {
    switch (table) {
        case 'participant':
            return handleParticipantUpdate(prisma, filter, value);

        case 'stage':
            return handleStageUpdate(prisma, filter, value);

        case 'group':
            return handleGroupUpdate(prisma, filter, value);

        case 'round':
            return handleRoundUpdate(prisma, filter, value);

        case 'match':
            return handleMatchUpdate(prisma, filter, value);

        case 'match_game':
            return handleMatchGameUpdate(prisma, filter, value);

        default:
            return false;
    }
}
