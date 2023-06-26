import { DataTypes } from 'brackets-manager/dist/types';
import { prisma } from '../../client';
import { GroupTransformer } from '../../transformers';

export async function handleGroupSelect(
  filter?: Partial<DataTypes['group']> | number,
): Promise<DataTypes['group'][] | DataTypes['group'] | null> {
  if (filter === undefined) {
    // Query all entries of table
    return prisma.group
      .findMany()
      .then((values) => values.map(GroupTransformer.from))
      .catch((e) => {
        console.error(e);
        return [];
      });
  }

  if (typeof filter === 'number') {
    // Find by Id
    return prisma.group
      .findFirst({
        where: { id: filter },
      })
      .then((value) => {
        if (value === null) {
          return null;
        }

        return GroupTransformer.from(value);
      })
      .catch((e) => {
        console.error(e);
        return null;
      });
  }

  return prisma.group
    .findMany({
      where: {
        id: filter.id,
        stageId: filter.stage_id,
        number: filter.number,
      },
    })
    .then((values) => values.map(GroupTransformer.from))
    .catch((e) => {
      console.error(e);
      return [];
    });
}
