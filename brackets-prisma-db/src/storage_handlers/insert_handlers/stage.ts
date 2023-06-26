import { DataTypes, OmitId } from 'brackets-manager/dist/types';
import { prisma } from '../../client';
import {
  StageTransformer,
  StageSettingsTransformer,
} from '../../transformers/';

export function handleStageInsert(
  values: OmitId<DataTypes['stage']> | OmitId<DataTypes['stage']>[],
): Promise<number> | Promise<boolean> {
  if (Array.isArray(values)) {
    return prisma.stage
      .createMany({
        data: values.map((v) => ({
          ...StageTransformer.to(v),
          settings: {
            create: {
              ...StageSettingsTransformer.to(v.settings),
            },
          },
        })),
      })
      .then(() => true)
      .catch((e) => {
        console.error(e);
        return false;
      });
  }

  return prisma.stage
    .create({
      data: {
        ...StageTransformer.to(values),
        settings: {
          create: {
            ...StageSettingsTransformer.to(values.settings),
          },
        },
      },
    })
    .then((v) => v.id)
    .catch((e) => {
      console.error(e);
      return -1;
    });
}
