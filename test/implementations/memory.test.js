require('../helpers/register-typescript');

const { InMemoryDatabase } = require('../../brackets-memory-db/index.ts');
const { runStorageSuite } = require('../storage-suite');

runStorageSuite('brackets-memory-db', () => ({ storage: new InMemoryDatabase() }));
