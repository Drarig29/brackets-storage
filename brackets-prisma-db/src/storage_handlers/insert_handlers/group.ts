import { DataTypes, OmitId } from 'brackets-manager/dist/types';
import { prisma } from '../../client';
import { GroupTransformer } from '../../transformers';

export function handleGroupInsert(
  values: OmitId<DataTypes['group']> | OmitId<DataTypes['group']>[],
): Promise<number> | Promise<boolean> {
  if (Array.isArray(values)) {
    return prisma.group
      .createMany({
        data: values.map(GroupTransformer.to),
      })
      .then(() => true)
      .catch((e) => {
        console.error(e);
        return false;
      });
  }

  return prisma.group
    .create({
      data: GroupTransformer.to(values),
    })
    .then((v) => v.id)
    .catch((e) => {
      console.error(e);
      return -1;
    });
}
