const assert = require('node:assert/strict');
const { describe, test } = require('node:test');

const Status = {
    Ready: 2,
    Running: 3,
};

function stripUndefined(value) {
    if (Array.isArray(value))
        return value.map(stripUndefined);

    if (!value || typeof value !== 'object')
        return value;

    return Object.fromEntries(
        Object.entries(value)
            .filter(([, entry]) => entry !== undefined)
            .map(([key, entry]) => [key, stripUndefined(entry)]),
    );
}

async function useStorage(t, createStorage) {
    const context = await createStorage();
    const storage = context.storage || context;

    t.after(async () => {
        if (context.cleanup)
            await context.cleanup();
    });

    return storage;
}

function participant(name, tournamentId = 1) {
    return { name, tournament_id: tournamentId };
}

async function insertBracketSkeleton(storage) {
    const participantId = await storage.insert('participant', participant('Team 1'));

    const stage = {
        tournament_id: 1,
        name: 'Main stage',
        type: 'single_elimination',
        number: 1,
        settings: {
            size: 4,
            seedOrdering: ['natural'],
            matchesChildCount: 3,
        },
    };
    const stageId = await storage.insert('stage', stage);

    const group = { stage_id: stageId, number: 1 };
    const groupId = await storage.insert('group', group);

    const round = { stage_id: stageId, group_id: groupId, number: 1 };
    const roundId = await storage.insert('round', round);

    const match = {
        stage_id: stageId,
        group_id: groupId,
        round_id: roundId,
        number: 1,
        child_count: 3,
        status: Status.Ready,
        opponent1: { id: participantId, score: 1 },
        opponent2: null,
    };
    const matchId = await storage.insert('match', match);

    const matchGame = {
        stage_id: stageId,
        parent_id: matchId,
        number: 1,
        status: Status.Ready,
        opponent1: { id: participantId },
        opponent2: null,
    };
    const matchGameId = await storage.insert('match_game', matchGame);

    return {
        participant: { id: participantId, ...participant('Team 1') },
        stage: { id: stageId, ...stage },
        group: { id: groupId, ...group },
        round: { id: roundId, ...round },
        match: { id: matchId, ...match },
        match_game: { id: matchGameId, ...matchGame },
    };
}

function runStorageSuite(name, createStorage) {
    describe(name, () => {
        test('inserts and selects rows in every table', async (t) => {
            const storage = await useStorage(t, createStorage);
            const rows = await insertBracketSkeleton(storage);

            for (const [table, expected] of Object.entries(rows)) {
                const selected = await storage.select(table, expected.id);
                assert.deepEqual(stripUndefined(selected), expected);

                const allRows = await storage.select(table);
                assert.deepEqual(stripUndefined(allRows), [expected]);
            }
        });

        test('selects multiple rows by filter', async (t) => {
            const storage = await useStorage(t, createStorage);

            assert.equal(await storage.insert('participant', [
                participant('Team 1', 7),
                participant('Team 2', 7),
                participant('Team 3', 8),
            ]), true);

            assert.deepEqual(
                (await storage.select('participant', { tournament_id: 7 })).map(({ name }) => name),
                ['Team 1', 'Team 2'],
            );
        });

        test('updates one row by id', async (t) => {
            const storage = await useStorage(t, createStorage);
            const rows = await insertBracketSkeleton(storage);
            const updated = {
                ...rows.match,
                status: Status.Running,
                opponent1: { id: rows.participant.id, score: 5 },
            };

            assert.equal(await storage.update('match', rows.match.id, updated), true);
            assert.deepEqual(stripUndefined(await storage.select('match', rows.match.id)), updated);
        });

        test('updates remaining rows by filter after deletion', async (t) => {
            const storage = await useStorage(t, createStorage);
            const firstId = await storage.insert('participant', participant('Team 1', 9));
            const secondId = await storage.insert('participant', participant('Team 2', 9));

            assert.equal(await storage.delete('participant', { id: firstId }), true);
            assert.equal(await storage.select('participant', firstId), null);
            assert.equal(await storage.update('participant', { id: secondId }, { name: 'Updated Team' }), true);

            assert.deepEqual(
                stripUndefined(await storage.select('participant', secondId)),
                { id: secondId, tournament_id: 9, name: 'Updated Team' },
            );
        });

        test('deletes rows by filter and clears a table', async (t) => {
            const storage = await useStorage(t, createStorage);

            assert.equal(await storage.insert('participant', [
                participant('Team 1', 3),
                participant('Team 2', 4),
            ]), true);

            assert.equal(await storage.delete('participant', { tournament_id: 3 }), true);
            assert.deepEqual(
                (await storage.select('participant')).map(({ name }) => name),
                ['Team 2'],
            );

            assert.equal(await storage.delete('participant'), true);
            assert.deepEqual(await storage.select('participant'), []);
        });

        test('returns cloned data from reads', async (t) => {
            const storage = await useStorage(t, createStorage);
            const rows = await insertBracketSkeleton(storage);
            const match = await storage.select('match', rows.match.id);

            match.opponent1.score = 99;

            assert.equal((await storage.select('match', rows.match.id)).opponent1.score, 1);
        });
    });
}

module.exports = { runStorageSuite };
