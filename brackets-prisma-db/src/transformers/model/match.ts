import * as Prisma from '@prisma/client';
import { Match } from 'brackets-model';
import { Transformer } from '../transformer';
import { OmitId } from 'brackets-manager';
import { MatchStatusTransformer, ParticipantMatchResultTransformer } from '..';

export const MatchTransformer = {
    to(input) {
        return {
            status: MatchStatusTransformer.to(input.status),
            stageId: input.stage_id,
            groupId: input.group_id,
            roundId: input.round_id,
            number: input.number,
            childCount: input.child_count,
        };
    },
    from(output) {
        return {
            id: output.id,
            status: MatchStatusTransformer.from(output.status),
            stage_id: output.stageId,
            group_id: output.groupId,
            round_id: output.roundId,
            number: output.number,
            child_count: output.childCount,
            opponent1: output.opponent1Result
                ? ParticipantMatchResultTransformer.from(output.opponent1Result)
                : null,
            opponent2: output.opponent2Result
                ? ParticipantMatchResultTransformer.from(output.opponent2Result)
                : null,
        };
    },
} satisfies Transformer<
    Omit<OmitId<Match>, 'opponent1' | 'opponent2'>,
    Omit<OmitId<Prisma.Match>, 'opponent1ResultId' | 'opponent2ResultId'>,
    Prisma.Match & {
        opponent1Result: Prisma.ParticipantMatchResult | null;
        opponent2Result: Prisma.ParticipantMatchResult | null;
    },
    Match
>;
