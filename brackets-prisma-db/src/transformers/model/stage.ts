import * as Prisma from '@prisma/client';
import { Stage } from 'brackets-model';
import { Transformer } from '../transformer';
import { OmitId } from 'brackets-manager';
import { StageSettingsTransformer, StageTypeTransformer } from '..';

export const StageTransformer = {
    to(input) {
        return {
            name: input.name,
            tournamentId: input.tournament_id,
            number: input.number,
            type: StageTypeTransformer.to(input.type),
        };
    },
    from(output) {
        return {
            id: output.id,
            name: output.name,
            tournament_id: output.tournamentId,
            number: output.number,
            type: StageTypeTransformer.from(output.type),
            settings: StageSettingsTransformer.from(output.settings),
        };
    },
} satisfies Transformer<
    Omit<OmitId<Stage>, 'settings'>,
    Omit<OmitId<Prisma.Stage>, 'settingsId'>,
    Prisma.Stage & { settings: Prisma.StageSettings },
    Stage
>;
