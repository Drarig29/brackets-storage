import { DataTypes } from 'brackets-manager/dist/types';
import {
    MatchResultTransformer,
    MatchStatusTransformer,
} from '../../transformers';
import { Prisma, PrismaClient } from '@prisma/client';
import { ParticipantResult } from 'brackets-model';

type MatchWithExtra = DataTypes['match'] & { extra?: Prisma.JsonValue | null };

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
): Prisma.XOR<Prisma.MatchUpdateInput, Prisma.MatchUncheckedUpdateInput> {
    return {
        stageId: value.stage_id,
        groupId: value.group_id,
        roundId: value.round_id,
        childCount: value.child_count,
        number: value.number,
        extra: value.extra ?? undefined,
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

function updateById(
    prisma: PrismaClient,
    id: number,
    value: Partial<MatchWithExtra> | MatchWithExtra,
) {
    return prisma.match.update({
        where: {
            id,
        },
        data: getUpdateData(value),
    });
}

export async function handleMatchUpdate(
    prisma: PrismaClient,
    filter: Partial<MatchWithExtra> | number,
    value: Partial<MatchWithExtra> | MatchWithExtra,
): Promise<boolean> {
    if (typeof filter === 'number') {
        // Update by Id
        return updateById(prisma, filter, value)
            .then(() => true)
            .catch(() => false);
    }

    return prisma.match
        .findMany({
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
        })
        .then((matches) => {
            return Promise.all(
                matches.map((match) => updateById(prisma, match.id, value)),
            );
        })
        .then(() => true)
        .catch(() => false);
}
