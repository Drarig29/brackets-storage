import * as Prisma from '@prisma/client';
import { SeedOrdering } from 'brackets-model';
import { Transformer } from '../transformer';

export const SeedOrderingTransformer = {
    to(ordering) {
        switch (ordering) {
            case 'natural':
                return Prisma.SeedOrdering.NATURAL;
            case 'reverse':
                return Prisma.SeedOrdering.REVERSE;
            case 'half_shift':
                return Prisma.SeedOrdering.HALF_SHIFT;
            case 'reverse_half_shift':
                return Prisma.SeedOrdering.REVERSE_HALF_SHIFT;
            case 'pair_flip':
                return Prisma.SeedOrdering.PAIR_FLIP;
            case 'inner_outer':
                return Prisma.SeedOrdering.INNER_OUTER;
            case 'groups.effort_balanced':
                return Prisma.SeedOrdering.GROUPS_EFFORT_BALANCED;
            case 'groups.seed_optimized':
                return Prisma.SeedOrdering.GROUPS_SEED_OPTIMIZED;
            case 'groups.bracket_optimized':
                return Prisma.SeedOrdering.GROUPS_BRACKET_OPTIMIZED;
        }
    },
    from(ordering) {
        switch (ordering) {
            case Prisma.SeedOrdering.NATURAL:
                return 'natural';
            case Prisma.SeedOrdering.REVERSE:
                return 'reverse';
            case Prisma.SeedOrdering.HALF_SHIFT:
                return 'half_shift';
            case Prisma.SeedOrdering.REVERSE_HALF_SHIFT:
                return 'reverse_half_shift';
            case Prisma.SeedOrdering.PAIR_FLIP:
                return 'pair_flip';
            case Prisma.SeedOrdering.INNER_OUTER:
                return 'inner_outer';
            case Prisma.SeedOrdering.GROUPS_EFFORT_BALANCED:
                return 'groups.effort_balanced';
            case Prisma.SeedOrdering.GROUPS_SEED_OPTIMIZED:
                return 'groups.seed_optimized';
            case Prisma.SeedOrdering.GROUPS_BRACKET_OPTIMIZED:
                return 'groups.bracket_optimized';
        }
    },
} satisfies Transformer<SeedOrdering, Prisma.SeedOrdering>;
