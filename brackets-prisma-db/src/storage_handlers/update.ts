import { DataTypes } from 'brackets-manager/dist/types';
import {
  handleGroupUpdate,
  handleMatchGameUpdate,
  handleMatchUpdate,
  handleParticipantUpdate,
  handleRoundUpdate,
  handleStageUpdate,
} from './update_handlers';

export async function handleUpdate<T extends keyof DataTypes>(
  table: T,
  filter: Partial<DataTypes[T]> | number,
  value: Partial<DataTypes[T]> | DataTypes[T],
): Promise<boolean> {
  switch (table) {
    case 'participant':
      return handleParticipantUpdate(filter, value);

    case 'stage':
      return handleStageUpdate(filter, value);

    case 'group':
      return handleGroupUpdate(filter, value);

    case 'round':
      return handleRoundUpdate(filter, value);

    case 'match':
      return handleMatchUpdate(filter, value);

    case 'match_game':
      return handleMatchGameUpdate(filter, value);

    default:
      return false;
  }
}
