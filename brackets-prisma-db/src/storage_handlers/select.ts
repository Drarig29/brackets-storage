import { DataTypes } from 'brackets-manager/dist/types';
import {
    handleGroupSelect,
    handleMatchGameSelect,
    handleMatchSelect,
    handleParticipantSelect,
    handleRoundSelect,
    handleStageSelect,
} from './select_handlers';
import { PrismaClient } from '@prisma/client';

export async function handleSelect<T extends keyof DataTypes>(
    prisma: PrismaClient,
    table: T,
    filter?: Partial<DataTypes[T]> | number,
): Promise<DataTypes[T][] | DataTypes[T] | null> {
    switch (table) {
        case 'participant':
            return handleParticipantSelect(prisma, filter) as unknown as
                | DataTypes[T][]
                | DataTypes[T]
                | null;

        case 'stage':
            return handleStageSelect(prisma, filter) as unknown as
                | DataTypes[T][]
                | DataTypes[T]
                | null;

        case 'group':
            return handleGroupSelect(prisma, filter) as unknown as
                | DataTypes[T][]
                | DataTypes[T]
                | null;

        case 'round':
            return handleRoundSelect(prisma, filter) as unknown as
                | DataTypes[T][]
                | DataTypes[T]
                | null;

        case 'match':
            return handleMatchSelect(prisma, filter) as unknown as
                | DataTypes[T][]
                | DataTypes[T]
                | null;

        case 'match_game':
            return handleMatchGameSelect(prisma, filter) as unknown as
                | DataTypes[T][]
                | DataTypes[T]
                | null;

        default:
            return null;
    }
}
