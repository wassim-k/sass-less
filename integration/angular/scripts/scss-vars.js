const fs = require('fs');
const path = require('path');
const { compileScssVariables } = require('sass-less-importer');

const files = [
    '../src/styles/variables.less'
];

(async function () {
    for (const file of files) {
        const lessPath = path.join(__dirname, file);
        const folderName = path.dirname(file);
        const fileName = path.basename(file, '.less');
        const variables = await compileScssVariables(lessPath);

        fs.writeFileSync(path.join(__dirname, folderName, `${fileName}.scss`), variables);

        console.log('Generated SCSS variables for \x1b[32m%s\x1b[0m', file);
    }
})();
