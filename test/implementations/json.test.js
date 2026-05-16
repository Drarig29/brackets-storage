const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
require('../helpers/register-typescript');

const { JsonDatabase } = require('../../brackets-json-db/index.ts');
const { runStorageSuite } = require('../storage-suite');

runStorageSuite('brackets-json-db', () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'brackets-json-db-'));

    return {
        storage: new JsonDatabase(path.join(directory, 'storage')),
        cleanup: () => fs.rmSync(directory, { recursive: true, force: true }),
    };
});
