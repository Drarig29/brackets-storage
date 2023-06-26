import { DataTypes } from 'brackets-manager/dist/types';
import { prisma } from '../../client';

export async function handleGroupUpdate(
  filter: Partial<DataTypes['group']> | number,
  value: Partial<DataTypes['group']> | DataTypes['group'],
): Promise<boolean> {
  if (typeof filter === 'number') {
    // Update by Id
    return prisma.group
      .update({
        where: {
          id: filter,
        },
        data: {
          number: value.number,
          stageId: value.stage_id,
        },
      })
      .then(() => true)
      .catch((e) => {
        console.error(e);
        return false;
      });
  }

  // Update by filter
  return prisma.group
    .updateMany({
      where: {
        id: filter.id,
        number: filter.number,
        stageId: filter.stage_id,
      },
      data: {
        number: value.number,
        stageId: value.stage_id,
      },
    })
    .then(() => true)
    .catch((e) => {
      console.error(e);
      return false;
    });
}
