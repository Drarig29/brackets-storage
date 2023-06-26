import * as Prisma from '@prisma/client';
import { RoundRobinMode } from 'brackets-model';
import { Transformer } from '../transformer';

export const RoundRobinModeTransformer = {
  to(mode) {
    switch (mode) {
      case 'simple':
        return Prisma.RoundRobinMode.SIMPLE;
      case 'double':
        return Prisma.RoundRobinMode.DOUBLE;
    }
  },
  from(mode) {
    switch (mode) {
      case Prisma.RoundRobinMode.SIMPLE:
        return 'simple';
      case Prisma.RoundRobinMode.DOUBLE:
        return 'double';
    }
  },
} satisfies Transformer<RoundRobinMode, Prisma.RoundRobinMode>