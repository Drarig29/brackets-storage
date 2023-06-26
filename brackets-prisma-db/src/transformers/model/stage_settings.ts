import * as Prisma from '@prisma/client';
import { StageSettings } from 'brackets-model';
import { Transformer } from '../transformer';
import { OmitId } from 'brackets-manager';
import {
  GrandFinalTypeTransformer,
  RoundRobinModeTransformer,
  SeedOrderingTransformer,
} from '..';

export const StageSettingsTransformer = {
  to(input) {
    return {
      size: input.size ?? null,
      seedOrdering: input.seedOrdering
        ? input.seedOrdering.map(SeedOrderingTransformer.to)
        : [],
      balanceByes: input.balanceByes ?? null,
      matchesChildCount: input.matchesChildCount ?? null,
      groupCount: input.groupCount ?? null,
      roundRobinMode: input.roundRobinMode
        ? RoundRobinModeTransformer.to(input.roundRobinMode)
        : null,
      manualOrdering: JSON.stringify(input.manualOrdering),
      consolationFinal: input.consolationFinal ?? null,
      skipFirstRound: input.skipFirstRound ?? null,
      grandFinal: input.grandFinal
        ? GrandFinalTypeTransformer.to(input.grandFinal)
        : null,
    };
  },
  from(output) {
    return {
      id:  output.id,
      size: output.size ?? undefined,
      seedOrdering: output.seedOrdering
        ? output.seedOrdering.map(SeedOrderingTransformer.from)
        : [],
      balanceByes: output.balanceByes ?? undefined,
      matchesChildCount: output.matchesChildCount ?? undefined,
      groupCount: output.groupCount ?? undefined,
      roundRobinMode: output.roundRobinMode
        ? RoundRobinModeTransformer.from(output.roundRobinMode)
        : undefined,
      manualOrdering: output.manualOrdering
        ? JSON.parse(output.manualOrdering?.toString())
        : undefined,
      consolationFinal: output.consolationFinal ?? undefined,
      skipFirstRound: output.skipFirstRound ?? undefined,
      grandFinal: output.grandFinal
        ? GrandFinalTypeTransformer.from(output.grandFinal)
        : undefined,
    };
  },
} satisfies Transformer<
  OmitId<StageSettings>,
  Omit<OmitId<Prisma.StageSettings>, 'stageId'>,
  Omit<Prisma.StageSettings, 'stageId'>,
  StageSettings
>;
