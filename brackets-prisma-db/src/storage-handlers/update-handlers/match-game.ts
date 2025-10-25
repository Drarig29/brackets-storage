import {
    MatchResultTransformer,
    MatchStatusTransformer,
    matchGameExtraFromInput,
} from '../../transformers';
import { Prisma, PrismaClient } from '@prisma/client';
import { ParticipantResult } from 'brackets-model';
import type { MatchGameWithExtra, MatchGameExtrasInput } from '../../types';

function getParticipantResultUpsertData(value: ParticipantResult): {
    upsert:
    | Prisma.ParticipantMatchGameResultUpsertWithoutOpponent1MatchGameInput
    | Prisma.ParticipantMatchGameResultUpsertWithoutOpponent2MatchGameInput;
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
    value: Partial<MatchGameWithExtra> | MatchGameWithExtra,
    previousExtra: Prisma.JsonValue | null,
): Prisma.XOR<Prisma.MatchGameUpdateInput, Prisma.MatchGameUncheckedUpdateInput> {
    const extrasInput = value as MatchGameExtrasInput;
    const extra = matchGameExtraFromInput(extrasInput, previousExtra);

    return {
        stageId: value.stage_id,
        matchId: value.parent_id,
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
        extra: extra ?? undefined
    };
}

async function updateById(
    prisma: PrismaClient,
    id: number,
    value: Partial<MatchGameWithExtra> | MatchGameWithExtra,
    previousExtra?: Prisma.JsonValue | null,
) {
    let extraSource = previousExtra ?? null;

    if (previousExtra === undefined) {
        const existing = await prisma.matchGame.findUnique({
            where: { id },
            select: { extra: true },
        });

        extraSource = existing?.extra ?? null;
    }

    return prisma.matchGame.update({
        where: {
            id,
        },
        data: getUpdateData(value, extraSource),
    });
}

export async function handleMatchGameUpdate(
    prisma: PrismaClient,
    filter: Partial<MatchGameWithExtra> | number,
    value: Partial<MatchGameWithExtra> | MatchGameWithExtra,
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
        const games = await prisma.matchGame.findMany({
            where: {
                id: filter.id,
                number: filter.number,
                stageId: filter.stage_id,
                matchId: filter.parent_id,
                status: filter.status
                    ? MatchStatusTransformer.to(filter.status)
                    : undefined,
            },
        });

        await Promise.all(
            games.map((game) =>
                updateById(prisma, game.id, value, game.extra ?? null),
            ),
        );

        return true;
    } catch {
        return false;
    }
}
