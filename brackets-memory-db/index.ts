import * as rfdc from 'rfdc';
import { CrudInterface, OmitId, Table, Database } from 'brackets-model';

const clone = rfdc();

type TableRow = { id: number } & Record<string, any>;
type Filter = Record<string, any>;

export class InMemoryDatabase implements CrudInterface {
    protected data: Database = {
        participant: [],
        stage: [],
        group: [],
        round: [],
        match: [],
        match_game: [],
    };

    /**
     * @param data "import" data from external
     */
    setData(data: Database): void {
        this.data = data;
    }

    /**
     * @param partial Filter
     */
    makeFilter(partial: Filter): (entry: Filter) => boolean {
        return (entry: Filter): boolean => {
            let result = true;
            for (const key of Object.keys(partial))
                result = result && entry[key] === partial[key];

            return result;
        };
    }

    /**
     * Clearing all of the data
     */
    reset(): void {
        this.data = {
            participant: [],
            stage: [],
            group: [],
            round: [],
            match: [],
            match_game: [],
        };
    }

    insert<T>(table: Table, value: OmitId<T>): Promise<number>;
    /**
     * Inserts multiple values in the database.
     *
     * @param table Where to insert.
     * @param values What to insert.
     */
    insert<T>(table: Table, values: OmitId<T>[]): Promise<boolean>;

    /**
     * Implementation of insert
     *
     * @param table Where to insert.
     * @param values What to insert.
     */
    insert<T>(
        table: Table,
        values: OmitId<T> | OmitId<T>[],
    ): Promise<number> | Promise<boolean> {
        const rows = this.getTable(table);
        let id = rows.length > 0
            ? (Math.max(...rows.map(d => d.id)) + 1)
            : 0;

        if (!Array.isArray(values)) {
            try {
                rows.push({ id, ...(values as T) });
            } catch (error) {
                return new Promise<number>((resolve) => {
                    resolve(-1);
                });
            }
            return new Promise<number>((resolve) => {
                resolve(id);
            });
        }

        try {
            values.map((object) => {
                rows.push({ id: id++, ...(object as T) });
            });
        } catch (error) {
            return new Promise<boolean>((resolve) => {
                resolve(false);
            });
        }

        return new Promise<boolean>((resolve) => {
            resolve(true);
        });
    }

    /**
     * Gets all data from a table in the database.
     *
     * @param table Where to get from.
     */
    select<T>(table: Table): Promise<T[] | null>;
    /**
     * Gets specific data from a table in the database.
     *
     * @param table Where to get from.
     * @param id What to get.
     */
    select<T>(table: Table, id: number): Promise<T | null>;
    /**
     * Gets data from a table in the database with a filter.
     *
     * @param table Where to get from.
     * @param filter An object to filter data.
     */
    select<T>(table: Table, filter: Partial<T>): Promise<T[] | null>;

    /**
     * @param table Where to get from.
     * @param arg Arg.
     */
    select<T>(table: Table, arg?: number | Partial<T>): Promise<T | T[] | null> {
        try {
            if (arg === undefined) {
                return new Promise<T[]>((resolve) => {
                    resolve(this.getTable(table).map(clone) as T[]);
                });
            }

            if (typeof arg === 'number') {
                return new Promise<T | null>((resolve) => {
                    const found = this.getTable(table).find(d => d.id === arg);
                    resolve(found ? clone(found) as T : null);
                });
            }

            return new Promise<T[] | null>((resolve) => {
                resolve(this.getTable(table).filter(this.makeFilter(arg as Filter)).map(clone) as T[]);
            });
        } catch (error) {
            return new Promise<null>((resolve) => {
                resolve(null);
            });
        }
    }

    /**
     * Updates data in a table.
     *
     * @param table Where to update.
     * @param id What to update.
     * @param value How to update.
     */

    update<T>(table: Table, id: number, value: T): Promise<boolean>;

    /**
     * Updates data in a table.
     *
     * @param table Where to update.
     * @param filter An object to filter data.
     * @param value How to update.
     */
    update<T>(
        table: Table,
        filter: Partial<T>,
        value: Partial<T>
    ): Promise<boolean>;

    /**
     * Updates data in a table.
     *
     * @param table Where to update.
     * @param arg
     * @param value How to update.
     */
    update<T>(
        table: Table,
        arg: number | Partial<T>,
        value?: Partial<T>,
    ): Promise<boolean> {
        if (typeof arg === 'number') {
            try {
                const index = this.getEntityIndexById(table, arg);
                this.setEntityByIndex(table, index, value);
                return new Promise<boolean>((resolve) => {
                    resolve(true);
                });
            } catch (error) {
                return new Promise<boolean>((resolve) => {
                    resolve(false);
                });
            }
        }

        const values = this.getTable(table).filter(this.makeFilter(arg as Filter));
        if (!values) {
            return new Promise<boolean>((resolve) => {
                resolve(false);
            });
        }

        values.forEach((v) => {
            const index = this.getEntityIndexById(table, v.id);
            const existing = this.getTable(table)[index];
            const updateValue = value as Filter;
            for (const key in updateValue) {
                if (this.isObject(existing[key]) && this.isObject(updateValue[key])) {
                    Object.assign(existing[key], updateValue[key]); // For opponent objects, this does a deep merge of level 2.
                } else {
                    existing[key] = updateValue[key]; // Otherwise, do a simple value assignment.
                }
            }
            this.setEntityByIndex(table, index, existing);
        });

        return new Promise<boolean>((resolve) => {
            resolve(true);
        });
    }

    /**
     * Empties a table completely.
     *
     * @param table Where to delete everything.
     */
    delete(table: Table): Promise<boolean>;
    /**
     * Delete data in a table, based on a filter.
     *
     * @param table Where to delete in.
     * @param filter An object to filter data.
     */
    delete<T>(table: Table, filter: Partial<T>): Promise<boolean>;

    /**
     * Delete data in a table, based on a filter.
     *
     * @param table Where to delete in.
     * @param filter An object to filter data.
     */
    delete<T>(table: Table, filter?: Partial<T>): Promise<boolean> {
        const values = this.data[table];
        if (!values) {
            return new Promise<boolean>((resolve) => {
                resolve(false);
            });
        }

        if (!filter) {
            this.data[table] = [];

            return new Promise<boolean>((resolve) => {
                resolve(true);
            });
        }

        const predicate = this.makeFilter(filter);
        const negativeFilter = (value: any): boolean => !predicate(value);

        this.setTable(table, this.getTable(table).filter(negativeFilter));

        return new Promise<boolean>((resolve) => {
            resolve(true);
        });
    }

    /**
     * Find the index of a table entity by its id
     * 
     * @param table 
     * @param id 
     * @returns 
     */
    getEntityIndexById(table: Table, id: number) {
        const index = this.getTable(table).findIndex(e => e.id === id);
        if (index === -1) {
            throw new Error(`Entity in ${table} with id ${id} not found.`)
        }
        return index
    }

    /**
     * Set a table entity value by its index 
     * 
     * @param table 
     * @param index 
     * @param value 
     */
    setEntityByIndex<T>(table: Table, index: number, value: T) {
        this.getTable(table)[index] = value as TableRow;
    }

    private getTable(table: Table): TableRow[] {
        return this.data[table] as unknown as TableRow[];
    }

    private setTable(table: Table, values: TableRow[]): void {
        (this.data as unknown as Record<Table, TableRow[]>)[table] = values;
    }

    private isObject(value: unknown): value is Record<string, unknown> {
        return typeof value === 'object' && value !== null;
    }
}
