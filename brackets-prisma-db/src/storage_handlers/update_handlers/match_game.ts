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
  value: Partial<DataTypes['match_game']> | DataTypes['match_game'],
): Prisma.XOR<
  Prisma.MatchGameUpdateInput,
  Prisma.MatchGameUncheckedUpdateInput
> {
  return {
    stageId: value.stage_id,
    matchId: value.parent_id,
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
  value: Partial<DataTypes['match_game']> | DataTypes['match_game'],
) {
  return prisma.matchGame
    .update({
      where: {
        id,
      },
      data: getUpdateData(value),
    })
}

export async function handleMatchGameUpdate(
  filter: Partial<DataTypes['match_game']> | number,
  value: Partial<DataTypes['match_game']> | DataTypes['match_game'],
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


  return prisma.matchGame.findMany({
    where: {
      id: filter.id,
      number: filter.number,
      stageId: filter.stage_id,
      matchId: filter.parent_id,
      status: filter.status
        ? MatchStatusTransformer.to(filter.status)
        : undefined,
    }
  })
    .then((games) => {
      return Promise.all([games.map((game) => updateById(game.id, value))])
    })
    .then(() => true)
    .catch((e) => {
      console.error(e);
      return false;
    });
}
