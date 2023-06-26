import * as Prisma from '@prisma/client';
import { Participant } from 'brackets-model';
import { Transformer } from '../transformer';
import { OmitId } from 'brackets-manager';

export const ParticipantTransformer = {
    to(input) {
        return {
            name: input.name,
            tournamentId: input.tournament_id,
        };
    },
    from(output) {
        return {
            id: output.id,
            name: output.name,
            tournament_id: output.tournamentId,
        };
    },
} satisfies Transformer<
    OmitId<Participant>,
    OmitId<Prisma.Participant>,
    Prisma.Participant,
    Participant
>;
