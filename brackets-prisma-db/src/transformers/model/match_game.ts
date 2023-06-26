import * as Prisma from '@prisma/client';
import { MatchGame } from 'brackets-model';
import { Transformer } from '../transformer';
import { OmitId } from 'brackets-manager';
import { MatchStatusTransformer, ParticipantMatchResultTransformer } from '..';

export const MatchGameTransformer = {
  to(input) {
    return {
      status: MatchStatusTransformer.to(input.status),
      stageId: input.stage_id,
      matchId: input.parent_id,
      number: input.number,
    };
  },
  from(output) {
    return {
      id: output.id,
      status: MatchStatusTransformer.from(output.status),
      stage_id: output.stageId,
      parent_id: output.matchId,
      number: output.number,
      opponent1: output.opponent1Result
        ? ParticipantMatchResultTransformer.from(output.opponent1Result)
        : null,
      opponent2: output.opponent2Result
        ? ParticipantMatchResultTransformer.from(output.opponent2Result)
        : null,
    };
  },
} satisfies Transformer<
  Omit<OmitId<MatchGame>, 'opponent1' | 'opponent2'>,
  Omit<OmitId<Prisma.MatchGame>, 'opponent1ResultId' | 'opponent2ResultId'>,
  Prisma.MatchGame & {
    opponent1Result: Prisma.ParticipantMatchGameResult | null;
    opponent2Result: Prisma.ParticipantMatchGameResult | null;
  },
  MatchGame
>;
