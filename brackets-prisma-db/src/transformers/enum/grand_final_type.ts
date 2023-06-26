import * as Prisma from '@prisma/client';
import { GrandFinalType } from 'brackets-model';
import { Transformer } from '../transformer';

export const GrandFinalTypeTransformer = {
    to(type) {
        switch (type) {
            case 'none':
                return Prisma.GrandFinalType.NONE;
            case 'simple':
                return Prisma.GrandFinalType.SIMPLE;
            case 'double':
                return Prisma.GrandFinalType.DOUBLE;
        }
    },
    from(type) {
        switch (type) {
            case Prisma.GrandFinalType.NONE:
                return 'none';
            case Prisma.GrandFinalType.SIMPLE:
                return 'simple';
            case Prisma.GrandFinalType.DOUBLE:
                return 'double';
        }
    },
} satisfies Transformer<GrandFinalType, Prisma.GrandFinalType>;
