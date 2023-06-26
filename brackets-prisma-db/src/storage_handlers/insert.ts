import { DataTypes, OmitId } from 'brackets-manager/dist/types';
import {
  handleGroupInsert,
  handleParticipantInsert,
  handleStageInsert,
  handleRoundInsert,
  handleMatchGameInsert,
  handleMatchInsert,
} from './insert_handlers';

export async function handleInsert<T extends keyof DataTypes>(
  table: T,
  values: OmitId<DataTypes[T]> | OmitId<DataTypes[T]>[],
): Promise<number | boolean> {
  switch (table) {
    case 'participant':
      const participantValues = values as
        | OmitId<DataTypes['participant']>
        | OmitId<DataTypes['participant']>[];

      return handleParticipantInsert(participantValues);

    case 'stage':
      const stageValues = values as
        | OmitId<DataTypes['stage']>
        | OmitId<DataTypes['stage']>[];

      return handleStageInsert(stageValues);

    case 'group':
      const groupValues = values as
        | OmitId<DataTypes['group']>
        | OmitId<DataTypes['group']>[];

      return handleGroupInsert(groupValues);

    case 'round':
      const roundValues = values as
        | OmitId<DataTypes['round']>
        | OmitId<DataTypes['round']>[];

      return handleRoundInsert(roundValues);

    case 'match':
      const matchValues = values as
        | OmitId<DataTypes['match']>
        | OmitId<DataTypes['match']>[];

      return handleMatchInsert(matchValues);

    case 'match_game':
      const matchGameValues = values as
        | OmitId<DataTypes['match_game']>
        | OmitId<DataTypes['match_game']>[];

      return handleMatchGameInsert(matchGameValues);

    default:
      return false;
  }
}
