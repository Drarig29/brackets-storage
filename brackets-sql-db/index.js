// This file is just an example. Features and classes are missing.

export class SqlDatabase {

    async insert(table, arg) {
        switch (table) {
            case 'participant':
                return await Team.insertMissing(arg);

            case 'stage':
                const stage = new Stage(undefined, arg.tournament_id, arg.number, arg.name, stageType.keyToVal[arg.type], JSON.stringify(arg.settings));
                return await stage.insert() && stage.id;

            case 'group':
                const group = new Group(undefined, arg.stage_id, arg.number);
                return await group.insert() && group.id;

            case 'round':
                const round = new Round(undefined, arg.stage_id, arg.group_id, arg.number);
                return await round.insert() && round.id;

            case 'match':
                const match = new Match(undefined, arg.status, arg.stage_id, arg.group_id, arg.round_id,
                    arg.number, arg.child_count, null, null, null, JSON.stringify(arg.opponent1), JSON.stringify(arg.opponent2));
                return await match.insert() && match.id;

            case 'match_game':
                const matchGame = new MatchGame(undefined, arg.stage_id, arg.parent_id, arg.status, arg.number, null, null, null,
                    JSON.stringify(arg.opponent1), JSON.stringify(arg.opponent2));
                return await matchGame.insert() && matchGame.id;
        }
    }

    async select(table, arg) {
        switch (table) {
            case 'participant':
                if (typeof arg === 'number') {
                    const team = await Team.getById(arg);
                    return team && convertTeam(team);
                }

                if (arg.tournament_id) {
                    const teams = await Team.getByTournamentId(arg.tournament_id);
                    return teams && teams.map(convertTeam);
                }

                break;

            case 'stage':
                if (typeof arg === 'number') {
                    const stage = await Stage.getById(arg);
                    return stage && convertStage(stage);
                }

                if (arg.tournament_id && arg.number) {
                    const stage = await Stage.getByTournamentAndNumber(arg.tournament_id, arg.number);
                    return stage && [convertStage(stage)];
                }

                if (arg.tournament_id) {
                    const stages = await Stage.getByTournamentId(arg.tournament_id);
                    return stages && stages.map(convertStage);
                }

                break;

            case 'group':
                if (!arg) {
                    const groups = await Group.getAll();
                    return groups && groups.map(convertGroup);
                }

                if (typeof arg === 'number') {
                    const group = await Group.getById(arg);
                    return group && convertGroup(group);
                }

                if (arg.stage_id && arg.number) {
                    const group = await Group.getByStageAndNumber(arg.stage_id, arg.number);
                    return group && [convertGroup(group)];
                }

                if (arg.stage_id) {
                    const groups = await Group.getByStageId(arg.stage_id);
                    return groups && groups.map(convertGroup);
                }

                break;

            case 'round':
                if (!arg) {
                    const rounds = await Round.getAll();
                    return rounds && rounds.map(convertRound);
                }

                if (typeof arg === 'number') {
                    const round = await Round.getById(arg);
                    return round && convertRound(round);
                }

                if (arg.group_id && arg.number) {
                    const round = await Round.getByGroupAndNumber(arg.group_id, arg.number);
                    return round && [convertRound(round)];
                }

                if (arg.group_id) {
                    const rounds = await Round.getByGroupId(arg.group_id);
                    return rounds && rounds.map(convertRound);
                }

                if (arg.stage_id) {
                    const rounds = await Round.getByStageId(arg.stage_id);
                    return rounds && rounds.map(convertRound);
                }

                break;

            case 'match':
                if (!arg) {
                    const matches = await Match.getAll();
                    return matches && matches.map(convertMatch);
                }

                if (typeof arg === 'number') {
                    const match = await Match.getById(arg);
                    return match && convertMatch(match);
                }

                if (arg.round_id && arg.number) {
                    const match = await Match.getByRoundAndNumber(arg.round_id, arg.number);
                    return match && [convertMatch(match)];
                }

                if (arg.stage_id) {
                    const matches = await Match.getByStageId(arg.stage_id);
                    return matches && matches.map(convertMatch);
                }

                if (arg.group_id) {
                    const matches = await Match.getByGroupId(arg.group_id);
                    return matches && matches.map(convertMatch);
                }

                if (arg.round_id) {
                    const matches = await Match.getByRoundId(arg.round_id);
                    return matches && matches.map(convertMatch);
                }

                break;

            case 'match_game':
                if (typeof arg === 'number') {
                    const game = await MatchGame.getById(arg);
                    return game && convertMatchGame(game);
                }

                if (arg.parent_id && arg.number) {
                    const game = await MatchGame.getByParentAndNumber(arg.parent_id, arg.number);
                    return game && [convertMatchGame(game)];
                }

                if (arg.parent_id) {
                    const games = await MatchGame.getByParentId(arg.parent_id);
                    return games && games.map(convertMatchGame);
                }

                break;
        }

        return null;
    }

    async update(table, query, update) {
        switch (table) {
            case 'stage':
                if (typeof query === 'number') {
                    const stage = new Stage(query);
                    return await stage.updateSettings(JSON.stringify(update.settings));
                }

                break;

            case 'match':
                if (typeof query === 'number') {
                    const match = new Match(query, update.status, update.stage_id, update.group_id, update.round_id,
                        update.number, update.child_count, null, null, null, JSON.stringify(update.opponent1), JSON.stringify(update.opponent2));

                    return await match.update();
                }

                if (query.stage_id)
                    return await Match.updateChildCountByStage(query.stage_id, update.child_count);


                if (query.group_id)
                    return await Match.updateChildCountByGroup(query.group_id, update.child_count);


                if (query.round_id)
                    return await Match.updateChildCountByRound(query.round_id, update.child_count);


                break;

            case 'match_game':
                if (typeof query === 'number') {
                    const game = new MatchGame(query, update.stage_id, update.parent_id, update.status, update.number,
                        null, null, null, JSON.stringify(update.opponent1), JSON.stringify(update.opponent2));

                    return await game.update();
                }

                if (query.parent_id) {
                    const game = new MatchGame(undefined, update.stage_id, query.parent_id, update.status, update.number,
                        null, null, null, JSON.stringify(update.opponent1), JSON.stringify(update.opponent2));

                    return await game.updateByParentId();
                }

                break;
        }

        return false;
    }

    async delete(table, filter) {
        switch (table) {
            case 'stage':
                return Number.isInteger(filter.id) && Stage.deleteById(filter.id);

            case 'group':
                return Number.isInteger(filter.stage_id) && Group.deleteByStageId(filter.stage_id);

            case 'round':
                return Number.isInteger(filter.stage_id) && Round.deleteByStageId(filter.stage_id);

            case 'match':
                return Number.isInteger(filter.stage_id) && Match.deleteByStageId(filter.stage_id);

            case 'match_game':
                if (Number.isInteger(filter.stage_id)) return MatchGame.deleteByStageId(filter.stage_id);
                if (Number.isInteger(filter.parent_id) && Number.isInteger(filter.number)) return MatchGame.deleteByParentAndNumber(filter.parent_id, filter.number);
                else return false;

            default:
                return false;
        }
    }
}
