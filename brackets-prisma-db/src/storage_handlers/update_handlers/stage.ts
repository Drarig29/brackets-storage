import { DataTypes } from 'brackets-manager/dist/types';
import {
    GrandFinalTypeTransformer,
    RoundRobinModeTransformer,
    SeedOrderingTransformer,
    StageTypeTransformer,
} from '../../transformers';
import { PrismaClient } from '@prisma/client';

export async function handleStageUpdate(
    prisma: PrismaClient,
    filter: Partial<DataTypes['stage']> | number,
    value: Partial<DataTypes['stage']> | DataTypes['stage'],
): Promise<boolean> {
    if (typeof filter !== 'number') {
        return false;
    }

    return prisma.stage
        .update({
            where: {
                id: filter,
            },
            data: {
                name: value.name,
                number: value.number,
                tournamentId: value.tournament_id,
                type: value.type
                    ? StageTypeTransformer.to(value.type)
                    : undefined,
                settings: value.settings
                    ? {
                          update: {
                              size: value.settings.size,
                              seedOrdering: value.settings.seedOrdering
                                  ? value.settings.seedOrdering.map(
                                        SeedOrderingTransformer.to,
                                    )
                                  : undefined,
                              balanceByes: value.settings.balanceByes,
                              matchesChildCount:
                                  value.settings.matchesChildCount,
                              groupCount: value.settings.groupCount,
                              roundRobinMode: value.settings.roundRobinMode
                                  ? RoundRobinModeTransformer.to(
                                        value.settings.roundRobinMode,
                                    )
                                  : undefined,
                              manualOrdering: value.settings.manualOrdering
                                  ? JSON.stringify(
                                        value.settings.manualOrdering,
                                    )
                                  : undefined,
                              consolationFinal: value.settings.consolationFinal,
                              skipFirstRound: value.settings.skipFirstRound,
                              grandFinal: value.settings.grandFinal
                                  ? GrandFinalTypeTransformer.to(
                                        value.settings.grandFinal,
                                    )
                                  : undefined,
                          },
                      }
                    : undefined,
            },
        })
        .then(() => true)
        .catch((e) => {
            console.error(e);
            return false;
        });
}
