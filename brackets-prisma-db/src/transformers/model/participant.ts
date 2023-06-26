import * as Prisma from '@prisma/client';
import { Participant } from 'brackets-model';
import { Transformer } from '../transformer';
import { OmitId } from 'brackets-manager';

function getParticipantExtras(
    input: Partial<Participant> & Record<string, unknown>,
): Record<string, unknown> {
    const clone = { ...input };
    // Delete Participant fields
    delete clone.id;
    delete clone.name;
    delete clone.tournament_id;
    // Return Extras
    return clone;
}

export const ParticipantTransformer = {
    to(input) {
        return {
            name: input.name,
            tournamentId: input.tournament_id,
            ...getParticipantExtras(input),
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
