require('../helpers/register-typescript');

const { SqlDatabase } = require('../../brackets-prisma-db/src/index.ts');
const { createFakePrisma } = require('../helpers/fake-prisma');
const { runStorageSuite } = require('../storage-suite');

runStorageSuite('brackets-prisma-db', () => ({ storage: new SqlDatabase(createFakePrisma()) }));
