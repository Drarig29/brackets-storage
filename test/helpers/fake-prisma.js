function clone(value) {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function withoutUndefined(value) {
    return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined));
}

function matchesWhere(row, where = {}) {
    return Object.entries(where).every(([key, value]) => value === undefined || row[key] === value);
}

function normalizeParticipantResult(input) {
    if (!input)
        return null;

    if (input.create)
        return clone(input.create);

    if (input.upsert)
        return clone(input.upsert.update || input.upsert.create);

    return clone(input);
}

function normalizeCreateData(model, data) {
    const row = { ...data };

    if (model === 'stage' && row.settings && row.settings.create)
        row.settings = clone(row.settings.create);

    if (model === 'match' || model === 'matchGame') {
        row.opponent1Result = normalizeParticipantResult(row.opponent1Result);
        row.opponent2Result = normalizeParticipantResult(row.opponent2Result);
    }

    return withoutUndefined(row);
}

function normalizeUpdateData(model, row, data) {
    const update = { ...data };

    if (model === 'stage' && update.settings) {
        const settingsUpdate = update.settings.update || update.settings.create || {};
        update.settings = withoutUndefined({ ...(row.settings || {}), ...settingsUpdate });
    }

    if (model === 'match' || model === 'matchGame') {
        if (update.opponent1Result)
            update.opponent1Result = withoutUndefined({
                ...(row.opponent1Result || {}),
                ...normalizeParticipantResult(update.opponent1Result),
            });

        if (update.opponent2Result)
            update.opponent2Result = withoutUndefined({
                ...(row.opponent2Result || {}),
                ...normalizeParticipantResult(update.opponent2Result),
            });
    }

    return withoutUndefined(update);
}

function sortRows(model, rows) {
    const sorted = [...rows];

    if (model === 'match')
        return sorted.sort((a, b) => (a.roundId - b.roundId) || (a.number - b.number));

    if (['stage', 'group', 'round', 'matchGame'].includes(model))
        return sorted.sort((a, b) => a.number - b.number);

    return sorted;
}

class FakeDelegate {
    constructor(model) {
        this.model = model;
        this.rows = [];
        this.nextId = 0;
    }

    async create({ data }) {
        const row = { id: this.nextId++, ...normalizeCreateData(this.model, data) };
        this.rows.push(row);
        return clone(row);
    }

    async createMany({ data }) {
        data.forEach((entry) => {
            const row = { id: this.nextId++, ...normalizeCreateData(this.model, entry) };
            this.rows.push(row);
        });

        return { count: data.length };
    }

    async findMany({ where } = {}) {
        return clone(sortRows(this.model, this.rows.filter((row) => matchesWhere(row, where))));
    }

    async findFirst({ where } = {}) {
        return clone(this.rows.find((row) => matchesWhere(row, where)) || null);
    }

    async findUnique({ where, select } = {}) {
        const row = this.rows.find((entry) => matchesWhere(entry, where));
        if (!row)
            return null;

        if (!select)
            return clone(row);

        return clone(Object.fromEntries(Object.keys(select).map((key) => [key, row[key]])));
    }

    async update({ where, data }) {
        const index = this.rows.findIndex((row) => matchesWhere(row, where));
        if (index === -1)
            throw new Error(`${this.model} not found.`);

        this.rows[index] = {
            ...this.rows[index],
            ...normalizeUpdateData(this.model, this.rows[index], data),
        };

        return clone(this.rows[index]);
    }

    async updateMany({ where, data }) {
        let count = 0;

        this.rows = this.rows.map((row) => {
            if (!matchesWhere(row, where))
                return row;

            count++;
            return { ...row, ...normalizeUpdateData(this.model, row, data) };
        });

        return { count };
    }

    async deleteMany({ where } = {}) {
        const before = this.rows.length;
        this.rows = this.rows.filter((row) => !matchesWhere(row, where));

        return { count: before - this.rows.length };
    }
}

function createFakePrisma() {
    return {
        participant: new FakeDelegate('participant'),
        stage: new FakeDelegate('stage'),
        group: new FakeDelegate('group'),
        round: new FakeDelegate('round'),
        match: new FakeDelegate('match'),
        matchGame: new FakeDelegate('matchGame'),
    };
}

module.exports = { createFakePrisma };
