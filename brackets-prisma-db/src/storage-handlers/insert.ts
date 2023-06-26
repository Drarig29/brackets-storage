import { DataTypes, OmitId } from 'brackets-manager/dist/types';
import {
    handleGroupInsert,
    handleParticipantInsert,
    handleStageInsert,
    handleRoundInsert,
    handleMatchGameInsert,
    handleMatchInsert,
} from './insert-handlers';
import { PrismaClient } from '@prisma/client';

export async function handleInsert<T extends keyof DataTypes>(
    prisma: PrismaClient,
    table: T,
    values: OmitId<DataTypes[T]> | OmitId<DataTypes[T]>[],
): Promise<number | boolean> {
    switch (table) {
        case 'participant':
            const participantValues = values as
                | OmitId<DataTypes['participant']>
                | OmitId<DataTypes['participant']>[];

            return handleParticipantInsert(prisma, participantValues);

        case 'stage':
            const stageValues = values as
                | OmitId<DataTypes['stage']>
                | OmitId<DataTypes['stage']>[];

            return handleStageInsert(prisma, stageValues);

        case 'group':
            const groupValues = values as
                | OmitId<DataTypes['group']>
                | OmitId<DataTypes['group']>[];

            return handleGroupInsert(prisma, groupValues);

        case 'round':
            const roundValues = values as
                | OmitId<DataTypes['round']>
                | OmitId<DataTypes['round']>[];

            return handleRoundInsert(prisma, roundValues);

        case 'match':
            const matchValues = values as
                | OmitId<DataTypes['match']>
                | OmitId<DataTypes['match']>[];

            return handleMatchInsert(prisma, matchValues);

        case 'match_game':
            const matchGameValues = values as
                | OmitId<DataTypes['match_game']>
                | OmitId<DataTypes['match_game']>[];

            return handleMatchGameInsert(prisma, matchGameValues);

        default:
            return false;
    }
}
