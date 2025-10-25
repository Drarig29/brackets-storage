import type {
    Match as PrismaMatch,
    ParticipantMatchResult as PrismaParticipantMatchResult,
    Prisma,
} from '@prisma/client';
import { Match } from 'brackets-model';
import { Transformer } from '../transformer';
import { OmitId } from 'brackets-manager';
import { MatchStatusTransformer, ParticipantMatchResultTransformer } from '..';

type MatchWithExtra = Match & { extra?: Prisma.JsonValue | null };
type MatchExtrasInput = Partial<MatchWithExtra> & Record<string, unknown>;
type PrismaMatchWithRelations = PrismaMatch & {
    opponent1Result: PrismaParticipantMatchResult | null;
    opponent2Result: PrismaParticipantMatchResult | null;
    extra: Prisma.JsonValue | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getMatchExtras(input: MatchExtrasInput): Prisma.JsonObject {
    const clone = { ...input } as Record<string, unknown>;

    delete clone.id;
    delete clone.status;
    delete clone.stage_id;
    delete clone.group_id;
    delete clone.round_id;
    delete clone.number;
    delete clone.child_count;
    delete clone.opponent1;
    delete clone.opponent2;
    delete clone.extra;

    return Object.entries(clone).reduce<Prisma.JsonObject>((extras, [key, value]) => {
        if (value !== undefined) {
            extras[key] = value as Prisma.JsonValue;
        }

        return extras;
    }, {});
}

function normalizeMatchExtras(extra: unknown): Record<string, unknown> {
    if (!isRecord(extra)) {
        return {};
    }

    return extra;
}

function hasOwnExtraProperty(input: MatchExtrasInput): boolean {
    return Object.prototype.hasOwnProperty.call(input, 'extra');
}

export function matchExtraFromInput(
    input: MatchExtrasInput,
    previousExtra?: Prisma.JsonValue | null,
): Prisma.JsonValue | null | undefined {
    const customFields = getMatchExtras(input);
    const hasCustomFields = Object.keys(customFields).length > 0;

    if (hasOwnExtraProperty(input)) {
        const providedExtra = input.extra as Prisma.JsonValue | null | undefined;

        if (providedExtra === undefined) {
            return hasCustomFields ? customFields : undefined;
        }

        if (isRecord(providedExtra)) {
            const normalized = providedExtra as Prisma.JsonObject;

            return hasCustomFields
                ? { ...normalized, ...customFields }
                : normalized;
        }

        return providedExtra ?? null;
    }

    if (!hasCustomFields) {
        return undefined;
    }

    if (isRecord(previousExtra)) {
        const normalized = previousExtra as Prisma.JsonObject;

        return { ...normalized, ...customFields };
    }

    return customFields;
}

export const MatchTransformer = {
    to(input: Omit<OmitId<MatchWithExtra>, 'opponent1' | 'opponent2'>) {
        const extrasInput = input as unknown as MatchExtrasInput;
        const extra = matchExtraFromInput(extrasInput);

        return {
            status: MatchStatusTransformer.to(input.status),
            stageId: input.stage_id,
            groupId: input.group_id,
            roundId: input.round_id,
            number: input.number,
            childCount: input.child_count,
            ...(extra !== undefined ? { extra } : {}),
        };
    },
    from(output: PrismaMatchWithRelations) {
        const normalizedExtras = normalizeMatchExtras(output.extra);

        return {
            id: output.id,
            status: MatchStatusTransformer.from(output.status),
            stage_id: output.stageId,
            group_id: output.groupId,
            round_id: output.roundId,
            number: output.number,
            child_count: output.childCount,
            ...normalizedExtras,
            extra: output.extra ?? undefined,
            opponent1: output.opponent1Result
                ? ParticipantMatchResultTransformer.from(output.opponent1Result)
                : null,
            opponent2: output.opponent2Result
                ? ParticipantMatchResultTransformer.from(output.opponent2Result)
                : null,
        };
    },
} satisfies Transformer<
    Omit<OmitId<MatchWithExtra>, 'opponent1' | 'opponent2'>,
    Omit<OmitId<PrismaMatch>, 'opponent1ResultId' | 'opponent2ResultId'> & {
        extra?: Prisma.JsonValue | null;
    },
    PrismaMatchWithRelations,
    MatchWithExtra
>;
