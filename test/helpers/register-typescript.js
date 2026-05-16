const fs = require('node:fs');
const ts = require('typescript');

if (!require.extensions['.ts']) {
    require.extensions['.ts'] = (module, filename) => {
        const source = fs.readFileSync(filename, 'utf8');
        const { outputText } = ts.transpileModule(source, {
            compilerOptions: {
                esModuleInterop: false,
                module: ts.ModuleKind.CommonJS,
                target: ts.ScriptTarget.ES2022,
            },
            fileName: filename,
        });

        module._compile(outputText, filename);
    };
}
