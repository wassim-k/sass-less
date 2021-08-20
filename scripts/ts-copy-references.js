const { copyRecursiveSync, processFiles } = require('./utils');
const fs = require('fs');
const path = require('path');

if (process.argv.length !== 3) throw new Error('Invalid arguments');
const args = process.argv.slice(2);

const projectFile = args[0];
const projectPath = path.resolve(projectFile);
const tsConfig = require(projectPath);
const distPath = tsConfig.compilerOptions.outDir;
const { references } = tsConfig;

if (!references) {
    console.warn('no project references were found.');
    return;
}

for (const reference of references) {
    // Copy reference project dist
    const dstProjectPath = path.resolve(reference.path, 'tsconfig.json');
    const dstTsConfig = require(dstProjectPath);
    const refDistPath = dstTsConfig.compilerOptions.outDir;

    const src = path.resolve(reference.path, refDistPath);
    const dst = path.resolve(distPath, path.basename(reference.path));
    console.log(src, ' => ', dst);
    copyRecursiveSync(src, dst);

    // Update imports
    const relativePath = path.relative(distPath, reference.path);
    processFiles(distPath, (filepath, level) => updateImports(filepath, level, relativePath), folderPath => { });
}

function updateImports(filepath, level, relativePath) {
    let contents = fs.readFileSync(filepath, 'utf-8');
    const leafName = path.basename(relativePath);
    const sequence = [...new Array(level)];

    for (const sep of ['\\', '/']) {
        const oldRelativePath = sequence.reduce(acc => `..${sep}${acc}`, relativePath.replace(/[\\\/]/g, sep));
        const newRelativePath = level === 0 ? `.${sep}${leafName}` : sequence.reduce(acc => `..${sep}${acc}`, leafName);
        contents = contents.replace(new RegExp(`"${oldRelativePath}"`, 'gm'), `"${newRelativePath}"`);
    }

    fs.writeFileSync(filepath, contents, 'utf-8');
}
