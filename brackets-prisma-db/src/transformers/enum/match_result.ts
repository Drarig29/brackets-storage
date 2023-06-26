import * as Prisma from '@prisma/client';
import { Result } from 'brackets-model';
import { Transformer } from '../transformer';

export const MatchResultTransformer = {
  to(result) {
    switch (result) {
      case 'win':
        return Prisma.MatchResult.WIN;
      case 'draw':
        return Prisma.MatchResult.DRAW;
      case 'loss':
        return Prisma.MatchResult.LOSS;
    }
  },
  from(result) {
    switch (result) {
      case Prisma.MatchResult.WIN:
        return 'win';
      case Prisma.MatchResult.DRAW:
        return 'draw';
      case Prisma.MatchResult.LOSS:
        return 'loss';
    }
  },
} satisfies Transformer<Result, Prisma.MatchResult>;
