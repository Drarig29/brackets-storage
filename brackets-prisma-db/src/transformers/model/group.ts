import * as Prisma from '@prisma/client';
import { Group } from 'brackets-model';
import { Transformer } from '../transformer';
import { OmitId } from 'brackets-manager';

export const GroupTransformer = {
    to(input) {
        return {
            stageId: input.stage_id,
            number: input.number,
        };
    },
    from(output) {
        return {
            id: output.id,
            stage_id: output.stageId,
            number: output.number,
        };
    },
} satisfies Transformer<
    OmitId<Group>,
    OmitId<Prisma.Group>,
    Prisma.Group,
    Group
>;
