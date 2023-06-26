import { DataTypes } from 'brackets-manager/dist/types';
import { prisma } from '../../client';

export async function handleParticipantUpdate(
  filter: Partial<DataTypes['participant']> | number,
  value: Partial<DataTypes['participant']> | DataTypes['participant'],
): Promise<boolean> {
  if (typeof filter === 'number') {
    // Update by Id
    return prisma.participant
      .update({
        where: {
          id: filter,
        },
        data: {
          name: value.name,
          tournamentId: value.tournament_id,
        },
      })
      .then(() => true)
      .catch((e) => {
        console.error(e);
        return false;
      });
  }

  // Update by filter
  return prisma.participant
    .updateMany({
      where: {
        id: filter.id,
        name: filter.name,
        tournamentId: filter.tournament_id,
      },
      data: {
        name: value.name,
        tournamentId: value.tournament_id,
      },
    })
    .then(() => true)
    .catch((e) => {
      console.error(e);
      return false;
    });
}
