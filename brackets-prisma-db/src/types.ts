import { DataTypes } from 'brackets-model';
import { Prisma } from '@prisma/client';

export type MatchWithExtra = DataTypes['match'] & { extra?: Prisma.JsonValue | null };
export type MatchExtrasInput = Partial<MatchWithExtra> & Record<string, unknown>;

export type MatchGameWithExtra = DataTypes['match_game'] & { extra?: Prisma.JsonValue | null };
export type MatchGameExtrasInput = Partial<MatchGameWithExtra> & Record<string, unknown>;
