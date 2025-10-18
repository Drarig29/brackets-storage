import { DataTypes } from 'brackets-manager/dist/types';
import {
    MatchResultTransformer,
    MatchStatusTransformer,
    matchExtraFromInput,
} from '../../transformers';
import { Prisma, PrismaClient } from '@prisma/client';
import { ParticipantResult } from 'brackets-model';

type MatchWithExtra = DataTypes['match'] & { extra?: Prisma.JsonValue | null };
type MatchExtrasInput = Partial<MatchWithExtra> & Record<string, unknown>;

function getParticipantResultUpsertData(value: ParticipantResult): {
    upsert:
        | Prisma.ParticipantMatchResultUpsertWithoutOpponent1MatchInput
        | Prisma.ParticipantMatchResultUpsertWithoutOpponent2MatchInput;
} {
    return {
        upsert: {
            update: {
                participantId: value.id,
                forfeit: value.forfeit,
                position: value.position,
                score: value.score,
                result: value.result
                    ? MatchResultTransformer.to(value.result)
                    : undefined,
            },
            create: {
                participantId: value.id,
                forfeit: value.forfeit,
                position: value.position,
                score: value.score,
                result: value.result
                    ? MatchResultTransformer.to(value.result)
                    : undefined,
            },
        },
    };
}

function getUpdateData(
    value: Partial<MatchWithExtra> | MatchWithExtra,
    previousExtra: Prisma.JsonValue | null,
): Prisma.XOR<Prisma.MatchUpdateInput, Prisma.MatchUncheckedUpdateInput> {
    const extrasInput = value as MatchExtrasInput;
    const extra = matchExtraFromInput(extrasInput, previousExtra);

    return {
        stageId: value.stage_id,
        groupId: value.group_id,
        roundId: value.round_id,
        childCount: value.child_count,
        number: value.number,
        ...(extra !== undefined ? { extra } : {}),
        status: value.status
            ? MatchStatusTransformer.to(value.status)
            : undefined,
        opponent1Result: value.opponent1
            ? getParticipantResultUpsertData(value.opponent1)
            : undefined,
        opponent2Result: value.opponent2
            ? getParticipantResultUpsertData(value.opponent2)
            : undefined,
    };
}

async function updateById(
    prisma: PrismaClient,
    id: number,
    value: Partial<MatchWithExtra> | MatchWithExtra,
    previousExtra?: Prisma.JsonValue | null,
) {
    let extraSource = previousExtra ?? null;

    if (previousExtra === undefined) {
        const existing = await prisma.match.findUnique({
            where: { id },
            select: { extra: true },
        });

        extraSource = existing?.extra ?? null;
    }

    return prisma.match.update({
        where: {
            id,
        },
        data: getUpdateData(value, extraSource),
    });
}

export async function handleMatchUpdate(
    prisma: PrismaClient,
    filter: Partial<MatchWithExtra> | number,
    value: Partial<MatchWithExtra> | MatchWithExtra,
): Promise<boolean> {
    if (typeof filter === 'number') {
        // Update by Id
        try {
            await updateById(prisma, filter, value);

            return true;
        } catch {
            return false;
        }
    }

    try {
        const matches = await prisma.match.findMany({
            where: {
                id: filter.id,
                number: filter.number,
                stageId: filter.stage_id,
                groupId: filter.group_id,
                roundId: filter.round_id,
                status: filter.status
                    ? MatchStatusTransformer.to(filter.status)
                    : undefined,
            },
        });

        await Promise.all(
            matches.map((match) =>
                updateById(prisma, match.id, value, match.extra ?? null),
            ),
        );

        return true;
    } catch {
        return false;
    }
}
