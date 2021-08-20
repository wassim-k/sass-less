# Scss Importer for Less

## Introduction
Import `.scss` variables directly into `.less`

It simply makes the following possible:
**some.component.less**
```less
@import 'scss:./colors.scss';

.header {
  color: @primary-color; // variable imported from colors.scss
}
```

## Installation
```bash
npm install -D less-scss-importer
```

## Angular
You'll need to configure your project to use [@angular-builders/custom-webpack](https://www.npmjs.com/package/@angular-builders/custom-webpack) in order to use this library as a custom webpack loader.

Once that's done, you can simply modify **webpack.config.js** as follows:
```javascript
const { configureScssImporterForLess } = require('less-scss-importer');

module.exports = (config) => {
  return configureScssImporterForLess(config);
};
```

## React
You'll need to configure your project to use [react-app-rewired](https://www.npmjs.com/package/react-app-rewired) in order to use this library as a custom webpack loader.

Once that's done, you can simply modify **config-overrides.js** as follows:

```javascript
const { configureScssImporterForLess } = require('less-scss-importer');

module.exports = {
  webpack: function (config, env) {
    return configureScssImporterForLess(config);
  }
};
```

## Considerations
Due to limitations in the way `less-loader` works, imports of scss files must be prefixed with `scss:` as shown in the example above.
