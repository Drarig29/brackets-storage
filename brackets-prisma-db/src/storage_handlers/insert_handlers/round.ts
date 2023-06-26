import { DataTypes, OmitId } from 'brackets-manager/dist/types';
import { prisma } from '../../client';
import { RoundTransformer } from '../../transformers';

export function handleRoundInsert(
  values: OmitId<DataTypes['round']> | OmitId<DataTypes['round']>[],
): Promise<number> | Promise<boolean> {
  if (Array.isArray(values)) {
    return prisma.round
      .createMany({
        data: values.map(RoundTransformer.to),
      })
      .then(() => true)
      .catch((e) => {
        console.error(e);
        return false;
      });
  }

  return prisma.round
    .create({
      data: RoundTransformer.to(values),
    })
    .then((v) => v.id)
    .catch((e) => {
      console.error(e);
      return -1;
    });
}
