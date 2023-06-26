import { DataTypes } from 'brackets-manager/dist/types';
import {
  handleGroupSelect,
  handleMatchGameSelect,
  handleMatchSelect,
  handleParticipantSelect,
  handleRoundSelect,
  handleStageSelect,
} from './select_handlers';

export async function handleSelect<T extends keyof DataTypes>(
  table: T,
  filter?: Partial<DataTypes[T]> | number,
): Promise<DataTypes[T][] | DataTypes[T] | null> {
  switch (table) {
    case 'participant':
      return handleParticipantSelect(filter) as unknown as
        | DataTypes[T][]
        | DataTypes[T]
        | null;

    case 'stage':
      return handleStageSelect(filter) as unknown as
        | DataTypes[T][]
        | DataTypes[T]
        | null;

    case 'group':
      return handleGroupSelect(filter) as unknown as
        | DataTypes[T][]
        | DataTypes[T]
        | null;

    case 'round':
      return handleRoundSelect(filter) as unknown as
        | DataTypes[T][]
        | DataTypes[T]
        | null;

    case 'match':
      return handleMatchSelect(filter) as unknown as
        | DataTypes[T][]
        | DataTypes[T]
        | null;

    case 'match_game':
      return handleMatchGameSelect(filter) as unknown as
        | DataTypes[T][]
        | DataTypes[T]
        | null;

    default:
      return null;
  }
}
