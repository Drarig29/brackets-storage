import * as Prisma from '@prisma/client';
import { Status } from 'brackets-model';
import { Transformer } from '../transformer';

export const MatchStatusTransformer = {
  to(status) {
    switch (status) {
      case Status.Locked:
        return Prisma.MatchStatus.LOCKED;
      case Status.Waiting:
        return Prisma.MatchStatus.WAITING;
      case Status.Ready:
        return Prisma.MatchStatus.READY;
      case Status.Running:
        return Prisma.MatchStatus.RUNNING;
      case Status.Completed:
        return Prisma.MatchStatus.COMPLETED;
      case Status.Archived:
        return Prisma.MatchStatus.ARCHIVED;
    }
  },
  from(status) {
    switch (status) {
      case Prisma.MatchStatus.LOCKED:
        return Status.Locked;
      case Prisma.MatchStatus.WAITING:
        return Status.Waiting;
      case Prisma.MatchStatus.READY:
        return Status.Ready;
      case Prisma.MatchStatus.RUNNING:
        return Status.Running;
      case Prisma.MatchStatus.COMPLETED:
        return Status.Completed;
      case Prisma.MatchStatus.ARCHIVED:
        return Status.Archived;
    }
  },
} satisfies Transformer<Status, Prisma.MatchStatus>