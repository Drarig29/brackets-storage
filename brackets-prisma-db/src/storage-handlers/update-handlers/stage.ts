import { DataTypes, Id } from 'brackets-model';
import {
    GrandFinalTypeTransformer,
    RoundRobinModeTransformer,
    SeedOrderingTransformer,
    StageTypeTransformer,
} from '../../transformers';
import { PrismaClient } from '@prisma/client';
import { isModelId, toPrismaId } from '../../prisma-id';

export async function handleStageUpdate(
    prisma: PrismaClient,
    filter: Partial<DataTypes['stage']> | Id,
    value: Partial<DataTypes['stage']> | DataTypes['stage'],
): Promise<boolean> {
    if (!isModelId(filter)) {
        return false;
    }

    try {
        await prisma.stage.update({
            where: {
                id: toPrismaId(filter),
            },
            data: {
                name: value.name,
                number: value.number,
                tournamentId: toPrismaId(value.tournament_id),
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
        });

        return true;
    } catch {
        return false;
    }
}
