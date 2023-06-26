import * as Prisma from '@prisma/client';
import { Round } from 'brackets-model';
import { Transformer } from '../transformer';
import { OmitId } from 'brackets-manager';

export const RoundTransformer = {
  to(input) {
    return {
      stageId: input.stage_id,
      groupId: input.group_id,
      number: input.number,
    };
  },
  from(output) {
    return {
      id: output.id,
      stage_id: output.stageId,
      group_id: output.groupId,
      number: output.number,
    };
  },
} satisfies Transformer<
  OmitId<Round>,
  OmitId<Prisma.Round>,
  Prisma.Round,
  Round
>;
