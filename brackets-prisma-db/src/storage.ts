import { CrudInterface, OmitId } from 'brackets-manager';
import { DataTypes } from 'brackets-manager/dist/types';
import {
    handleInsert,
    handleDelete,
    handleUpdate,
    handleSelect,
} from './storage-handlers';
import { PrismaClient } from '@prisma/client';

export class SqlDatabase implements CrudInterface {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    insert<T extends keyof DataTypes>(
        table: T,
        value: OmitId<DataTypes[T]>,
    ): Promise<number>;
    insert<T extends keyof DataTypes>(
        table: T,
        values: OmitId<DataTypes[T]>[],
    ): Promise<boolean>;
    insert<T extends keyof DataTypes>(
        table: T,
        values: OmitId<DataTypes[T]> | OmitId<DataTypes[T]>[],
    ): Promise<number | boolean> {
        return handleInsert(this.prisma, table, values);
    }

    select<T extends keyof DataTypes>(table: T): Promise<DataTypes[T][] | null>;
    select<T extends keyof DataTypes>(
        table: T,
        id: number,
    ): Promise<DataTypes[T] | null>;
    select<T extends keyof DataTypes>(
        table: T,
        filter: Partial<DataTypes[T]>,
    ): Promise<DataTypes[T][] | null>;
    select<T extends keyof DataTypes>(
        table: T,
        filter?: Partial<DataTypes[T]> | number,
    ): Promise<DataTypes[T][] | DataTypes[T] | null> {
        return handleSelect(this.prisma, table, filter) as unknown as Promise<
            DataTypes[T][] | DataTypes[T] | null
        >;
    }

    update<T extends keyof DataTypes>(
        table: T,
        id: number,
        value: DataTypes[T],
    ): Promise<boolean>;
    update<T extends keyof DataTypes>(
        table: T,
        filter: Partial<DataTypes[T]>,
        value: Partial<DataTypes[T]>,
    ): Promise<boolean>;
    update<T extends keyof DataTypes>(
        table: T,
        filter: Partial<DataTypes[T]> | number,
        value: Partial<DataTypes[T]> | DataTypes[T],
    ): Promise<boolean> {
        return handleUpdate(this.prisma, table, filter, value);
    }

    delete<T extends keyof DataTypes>(table: T): Promise<boolean>;
    delete<T extends keyof DataTypes>(
        table: T,
        filter: Partial<DataTypes[T]>,
    ): Promise<boolean>;
    delete<T extends keyof DataTypes>(
        table: T,
        filter?: Partial<DataTypes[T]>,
    ): Promise<boolean> {
        return handleDelete(this.prisma, table, filter);
    }
}
