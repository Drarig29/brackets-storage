import {
    MatchResultTransformer,
    MatchStatusTransformer,
    matchExtraFromInput,
} from '../../transformers';
import { Prisma, PrismaClient } from '@prisma/client';
import { Id, ParticipantResult } from 'brackets-model';
import type { MatchExtrasInput, MatchWithExtra } from '../../types';
import { isModelId, toPrismaId } from '../../prisma-id';

function getParticipantResultUpsertData(value: ParticipantResult): {
    upsert:
    | Prisma.ParticipantMatchResultUpsertWithoutOpponent1MatchInput
    | Prisma.ParticipantMatchResultUpsertWithoutOpponent2MatchInput;
} {
    return {
        upsert: {
            update: {
                participantId: toPrismaId(value.id),
                forfeit: value.forfeit,
                position: value.position,
                score: value.score,
                result: value.result
                    ? MatchResultTransformer.to(value.result)
                    : undefined,
            },
            create: {
                participantId: toPrismaId(value.id),
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
        stageId: toPrismaId(value.stage_id),
        groupId: toPrismaId(value.group_id),
        roundId: toPrismaId(value.round_id),
        childCount: value.child_count,
        number: value.number,
        status: value.status
            ? MatchStatusTransformer.to(value.status)
            : undefined,
        opponent1Result: value.opponent1
            ? getParticipantResultUpsertData(value.opponent1)
            : undefined,
        opponent2Result: value.opponent2
            ? getParticipantResultUpsertData(value.opponent2)
            : undefined,
        extra: extra ?? undefined,
    };
}

async function updateById(
    prisma: PrismaClient,
    id: Id,
    value: Partial<MatchWithExtra> | MatchWithExtra,
    previousExtra?: Prisma.JsonValue | null,
) {
    let extraSource = previousExtra ?? null;

    if (previousExtra === undefined) {
        const existing = await prisma.match.findUnique({
            where: { id: toPrismaId(id) },
            select: { extra: true },
        });

        extraSource = existing?.extra ?? null;
    }

    return prisma.match.update({
        where: {
            id: toPrismaId(id),
        },
        data: getUpdateData(value, extraSource),
    });
}

export async function handleMatchUpdate(
    prisma: PrismaClient,
    filter: Partial<MatchWithExtra> | Id,
    value: Partial<MatchWithExtra> | MatchWithExtra,
): Promise<boolean> {
    if (isModelId(filter)) {
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
                id: toPrismaId(filter.id),
                number: filter.number,
                stageId: toPrismaId(filter.stage_id),
                groupId: toPrismaId(filter.group_id),
                roundId: toPrismaId(filter.round_id),
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
