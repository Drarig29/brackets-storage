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
    delete clone.extra;
    // Return Extras
    return clone;
}

function getParticipantExtraValue(
    input: Partial<Participant> & Record<string, unknown>,
): Record<string, unknown> | null {
    const extra = getParticipantExtras(input);

    return Object.keys(extra).length > 0 ? extra : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeParticipantExtras(extra: unknown): Record<string, unknown> {
    if (!isRecord(extra)) {
        return {};
    }

    return extra;
}

export function participantExtraFromInput(
    input: Partial<Participant> & Record<string, unknown>,
): Record<string, unknown> | null {
    return getParticipantExtraValue(input);
}

export const ParticipantTransformer = {
    to(input) {
        return {
            name: input.name,
            tournamentId: input.tournament_id,
            extra: getParticipantExtraValue(input),
        };
    },
    from(output) {
        return {
            id: output.id,
            name: output.name,
            tournament_id: output.tournamentId,
            ...normalizeParticipantExtras(output.extra),
        };
    },
} satisfies Transformer<
    OmitId<Participant>,
    OmitId<Prisma.Participant>,
    Prisma.Participant,
    Participant
>;
