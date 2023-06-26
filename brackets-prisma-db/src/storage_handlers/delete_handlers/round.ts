import { DataTypes } from 'brackets-manager/dist/types';
import { prisma } from '../../client';

export async function handleRoundDelete(
  filter?: Partial<DataTypes['round']>,
): Promise<boolean> {
  // No filter so delete everything
  if (!filter) {
    return prisma.round
      .deleteMany({})
      .then(() => true)
      .catch((e) => {
        console.error(e);
        return false;
      });
  }

  return prisma.round
    .deleteMany({
      where: {
        id: filter.id,
        stageId: filter.stage_id,
        groupId: filter.group_id,
        number: filter.number,
      },
    })
    .then(() => true)
    .catch((e) => {
      console.error(e);
      return false;
    });
}
