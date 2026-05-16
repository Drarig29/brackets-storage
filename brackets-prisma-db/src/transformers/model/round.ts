import * as Prisma from '@prisma/client';
import { Round } from 'brackets-model';
import { Transformer } from '../transformer';
import { OmitId } from 'brackets-model';
import { toPrismaId } from '../../prisma-id';

export const RoundTransformer = {
    to(input) {
        return {
            stageId: toPrismaId(input.stage_id),
            groupId: toPrismaId(input.group_id),
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
