import * as Prisma from '@prisma/client';
import { StageType } from 'brackets-model';
import { Transformer } from '../transformer';

export const StageTypeTransformer = {
    to(type) {
        switch (type) {
            case 'round_robin':
                return Prisma.StageType.ROUND_ROBIN;
            case 'single_elimination':
                return Prisma.StageType.SINGLE_ELIMINATION;
            case 'double_elimination':
                return Prisma.StageType.DOUBLE_ELIMINATION;
        }
    },
    from(type) {
        switch (type) {
            case Prisma.StageType.ROUND_ROBIN:
                return 'round_robin';
            case Prisma.StageType.SINGLE_ELIMINATION:
                return 'single_elimination';
            case Prisma.StageType.DOUBLE_ELIMINATION:
                return 'double_elimination';
        }
    },
} satisfies Transformer<StageType, Prisma.StageType>;
