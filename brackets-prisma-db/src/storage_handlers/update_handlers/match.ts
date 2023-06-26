import { DataTypes } from 'brackets-manager/dist/types';
import { prisma } from '../../client';
import {
  MatchResultTransformer,
  MatchStatusTransformer,
} from '../../transformers';
import { Prisma } from '@prisma/client';
import { ParticipantResult } from 'brackets-model';

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
  value: Partial<DataTypes['match']> | DataTypes['match'],
): Prisma.XOR<Prisma.MatchUpdateInput, Prisma.MatchUncheckedUpdateInput> {
  return {
    stageId: value.stage_id,
    groupId: value.group_id,
    roundId: value.round_id,
    childCount: value.child_count,
    number: value.number,
    status: value.status ? MatchStatusTransformer.to(value.status) : undefined,
    opponent1Result: value.opponent1
      ? getParticipantResultUpsertData(value.opponent1)
      : undefined,
    opponent2Result: value.opponent2
      ? getParticipantResultUpsertData(value.opponent2)
      : undefined,
  };
}

function updateById(
  id: number,
  value: Partial<DataTypes['match']> | DataTypes['match'],
) {
  return prisma.match.update({
    where: {
      id,
    },
    data: getUpdateData(value),
  });
}

export async function handleMatchUpdate(
  filter: Partial<DataTypes['match']> | number,
  value: Partial<DataTypes['match']> | DataTypes['match'],
): Promise<boolean> {
  if (typeof filter === 'number') {
    // Update by Id
    return updateById(filter, value)
      .then(() => true)
      .catch((e) => {
        console.error(e);
        return false;
      });
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
      return Promise.all([matches.map((match) => updateById(match.id, value))]);
    })
    .then(() => true)
    .catch((e) => {
      console.error(e);
      return false;
    });
}
