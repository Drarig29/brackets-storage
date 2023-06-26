import { DataTypes } from 'brackets-manager/dist/types';
import {
  handleGroupDelete,
  handleMatchDelete,
  handleMatchGameDelete,
  handleParticipantDelete,
  handleRoundDelete,
  handleStageDelete,
} from './delete_handlers';

// Can't be named `delete` because its a reserved word...
export async function handleDelete<T extends keyof DataTypes>(
  table: T,
  filter?: Partial<DataTypes[T]>,
): Promise<boolean> {
  switch (table) {
    case 'participant':
      return handleParticipantDelete(filter);

    case 'stage':
      return handleStageDelete(filter);

    case 'group':
      return handleGroupDelete(filter);

    case 'round':
      return handleRoundDelete(filter);

    case 'match':
      return handleMatchDelete(filter);

    case 'match_game':
      return handleMatchGameDelete(filter);

    default:
      return false;
  }
}
