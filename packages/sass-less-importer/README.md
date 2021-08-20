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

## Installation
```bash
npm install -D sass-less-importer
```

## Angular
You'll need to configure your project to use [@angular-builders/custom-webpack](https://www.npmjs.com/package/@angular-builders/custom-webpack) in order to use this library as a custom webpack loader.

Once that's done, you can simply modify **webpack.config.js** as follows:
```javascript
const { configureLessImporterForSass } = require('sass-less-importer');

module.exports = (config) => {
  return configureLessImporterForSass(config);
};
```

For a complete example, checkout **/integration/angular** project in the repository.

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

For a complete example, checkout **/integration/react** project in the repository.
