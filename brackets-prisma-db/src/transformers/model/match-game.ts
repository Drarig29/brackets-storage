import type {
    MatchGame as PrismaMatchGame,
    ParticipantMatchGameResult as PrismaParticipantMatchGameResult,
    Prisma,
} from '@prisma/client';
import { MatchGame } from 'brackets-model';
import { Transformer } from '../transformer';
import { OmitId } from 'brackets-manager';
import { MatchStatusTransformer, ParticipantMatchResultTransformer } from '..';

type MatchGameWithExtra = MatchGame & { extra?: Prisma.JsonValue | null };
type MatchGameExtrasInput = Partial<MatchGameWithExtra> & Record<string, unknown>;
type PrismaMatchGameWithRelations = PrismaMatchGame & {
    opponent1Result: PrismaParticipantMatchGameResult | null;
    opponent2Result: PrismaParticipantMatchGameResult | null;
    extra: Prisma.JsonValue | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getMatchGameExtras(input: MatchGameExtrasInput): Prisma.JsonObject {
    const clone = { ...input } as Record<string, unknown>;

    delete clone.id;
    delete clone.status;
    delete clone.stage_id;
    delete clone.parent_id;
    delete clone.number;
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

function normalizeMatchGameExtras(extra: unknown): Record<string, unknown> {
    if (!isRecord(extra)) {
        return {};
    }

    return extra;
}

function hasOwnExtraProperty(input: MatchGameExtrasInput): boolean {
    return Object.prototype.hasOwnProperty.call(input, 'extra');
}

export function matchGameExtraFromInput(
    input: MatchGameExtrasInput,
    previousExtra?: Prisma.JsonValue | null,
): Prisma.JsonValue | null | undefined {
    const customFields = getMatchGameExtras(input);
    const hasCustomFields = Object.keys(customFields).length > 0;

    if (hasOwnExtraProperty(input)) {
        const providedExtra = input.extra as Prisma.JsonValue | null | undefined;

        if (providedExtra === undefined) {
            return hasCustomFields ? customFields : undefined;
        }

        const sameAsPrevious = providedExtra === previousExtra;

        if (isRecord(providedExtra)) {
            const normalized = providedExtra as Prisma.JsonObject;

            return hasCustomFields
                ? { ...normalized, ...customFields }
                : normalized;
        }

        if (hasCustomFields && sameAsPrevious) {
            if (isRecord(previousExtra)) {
                const normalized = previousExtra as Prisma.JsonObject;

                return { ...normalized, ...customFields };
            }

            return customFields;
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

export const MatchGameTransformer = {
    to(input: Omit<OmitId<MatchGameWithExtra>, 'opponent1' | 'opponent2'>) {
        const extrasInput = input as unknown as MatchGameExtrasInput;
        const extra = matchGameExtraFromInput(extrasInput);

        return {
            status: MatchStatusTransformer.to(input.status),
            stageId: input.stage_id,
            matchId: input.parent_id,
            number: input.number,
            ...(extra !== undefined ? { extra } : {}),
        };
    },
    from(output: PrismaMatchGameWithRelations) {
        const normalizedExtras = normalizeMatchGameExtras(output.extra);

        return {
            id: output.id,
            status: MatchStatusTransformer.from(output.status),
            stage_id: output.stageId,
            parent_id: output.matchId,
            number: output.number,
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
    Omit<OmitId<MatchGameWithExtra>, 'opponent1' | 'opponent2'>,
    Omit<OmitId<PrismaMatchGame>, 'opponent1ResultId' | 'opponent2ResultId'>,
    PrismaMatchGameWithRelations,
    MatchGameWithExtra
>;
