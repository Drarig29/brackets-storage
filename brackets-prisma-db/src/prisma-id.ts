import type { Id } from 'brackets-model';

export class InvalidPrismaIdError extends Error {
    constructor(id: Id) {
        super(`Invalid Prisma integer id: ${JSON.stringify(id)}`);
    }
}

export function isModelId(value: unknown): value is Id {
    return typeof value === 'number' || typeof value === 'string';
}

export function toPrismaId(id: Id): number;
export function toPrismaId(id: null): null;
export function toPrismaId(id: undefined): undefined;
export function toPrismaId(id: Id | null): number | null;
export function toPrismaId(id: Id | undefined): number | undefined;
export function toPrismaId(id: Id | null | undefined): number | null | undefined {
    if (id === null || id === undefined) {
        return id;
    }

    if (typeof id === 'number') {
        if (Number.isSafeInteger(id)) {
            return id;
        }

        throw new InvalidPrismaIdError(id);
    }

    if (/^-?\d+$/.test(id)) {
        const numericId = Number(id);

        if (Number.isSafeInteger(numericId)) {
            return numericId;
        }
    }

    throw new InvalidPrismaIdError(id);
}
