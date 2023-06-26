import { DataTypes } from 'brackets-manager/dist/types';
import { prisma } from '../../client';

export async function handleGroupDelete(
  filter?: Partial<DataTypes['group']>,
): Promise<boolean> {
  // No filter so delete everything
  if (!filter) {
    return prisma.group
      .deleteMany({})
      .then(() => true)
      .catch((e) => {
        console.error(e);
        return false;
      });
  }

  return prisma.group
    .deleteMany({
      where: {
        id: filter.id,
        stageId: filter.stage_id,
        number: filter.number,
      },
    })
    .then(() => true)
    .catch((e) => {
      console.error(e);
      return false;
    });
}
