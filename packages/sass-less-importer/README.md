# Less Importer for Sass

## Introduction
This library was created for developers who prefer to use Sass in their projects but must depend on UI libraries that only support Less.

In our case it was developed for using sass styled components with [ant-design](https://ant.design/) UI library.

It simply makes the following possible:
**some.component.scss**
```scss
@import 'src/styles/theme.less';

.header {
  color: $primary-color; // variable imported from theme.less
}
```

## Features
* Import `.less` variables directly into `.scss` or `.sass` files.
* Supports hot reloading and recompilation on file change.
* Optimized use of webpack's caching.
* Works seamlessly with sass modules.
* Supports SASS modern and legacy APIs.

## Installation
### **npm**
```bash
npm install -D sass-less-importer
```
### **yarn**
```bash
yarn add -D sass-less-importer
```

## Angular v15+
Angular CLI removed support for custom SASS importers in v15, so the [method below using *custom-webpack*](#angular-v8-v14) is no longer viable.

This alternative solution works on all Angular versions and has the advantage of not requiring any customization of webpack.
As a result, Angular CLI can seamlessly replace **webpack** with **esbuild** for example, without requiring any modifications to your project.

### How does it work
* Add a hook `pre` ng build/serve which runs a script that generates a `variables.scss` files from a `variables.less` files.
* `@use ./variables.scss` in your *component.scss* files.

### Create ./scripts/scss-vars.js
```javascript
const fs = require('fs');
const path = require('path');
const { compileScssVariables } = require('sass-less-importer');

// Update to list of files that need to be converted to sass.
const files = [
    '../src/styles/variables.less' // <== this file has references to libraries like ant-design
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
```

### Update packages.json
```json
  "scripts": {
    "prestart": "yarn scss-vars",
    "start": "ng serve",
    "prebuild": "yarn scss-vars",
    "build": "ng build",
    "scss-vars": "node ./scripts/scss-vars.js",
    ...
  }
```

### Update .gitignore (optional)
```bash
# auto-generated files
src/styles/variables.scss

...
```

### Caveats
* Unlike a custom SASS importer, this solution requires manually re-running the script on file changes, or writing a file a watcher.

For a complete working example, checkout [**integration/angular**](https://github.com/wassim-k/sass-less/tree/master/integration/angular) project in the repository.

## Angular (v8-v14)
You'll need to configure your project to use [@angular-builders/custom-webpack](https://www.npmjs.com/package/@angular-builders/custom-webpack) in order to use this library as a custom webpack loader.

Once that's done, you can simply modify **webpack.config.js** as follows:
```javascript
const { configureLessImporterForSass } = require('sass-less-importer');

module.exports = (config) => {
  return configureLessImporterForSass(config);
};
```

## React
You'll need to configure your project to use [react-app-rewired](https://www.npmjs.com/package/react-app-rewired) in order to use this library as a custom webpack loader.

Once that's done, you can simply modify **config-overrides.js** as follows:

```javascript
const { configureLessImporterForSass } = require('sass-less-importer');

module.exports = {
  webpack: function (config, env) {
    return configureLessImporterForSass(config);
  }
};
```

For a complete working example, checkout [**integration/react**](https://github.com/wassim-k/sass-less/tree/master/integration/react) project in the repository.
