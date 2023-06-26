import * as Prisma from '@prisma/client';
import { ParticipantResult } from 'brackets-model';
import { Transformer } from '../transformer';
import { OmitId } from 'brackets-manager';
import { MatchResultTransformer } from '..';

export const ParticipantMatchResultTransformer = {
  to(input) {
    return {
      forfeit: input.forfeit ?? null,
      position: input.position ?? null,
      score: input.score ?? null,
      result: input.result ? MatchResultTransformer.to(input.result) : null,
    };
  },
  from(output) {
    return {
      id: output.participantId,
      forfeit: output.forfeit ?? undefined,
      position: output.position ?? undefined,
      score: output.score ?? undefined,
      result: output.result
        ? MatchResultTransformer.from(output.result)
        : undefined,
    };
  },
} satisfies Transformer<
  OmitId<ParticipantResult>,
  Omit<
    OmitId<Prisma.ParticipantMatchResult | Prisma.ParticipantMatchGameResult>,
    'participantId'
  >,
  Prisma.ParticipantMatchResult | Prisma.ParticipantMatchGameResult,
  ParticipantResult
>;
