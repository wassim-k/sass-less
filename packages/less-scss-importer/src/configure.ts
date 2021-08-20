import semver from 'semver';
import type webpack from 'webpack';
import { hasLoader, memoize, modifyLoaderOptions } from '../../webpack-utils';
import { scssImporterPluginWebpack } from './pluginWebpack';
type LoaderContext = webpack.loader.LoaderContext;

/**
 * Add scss-vars-loader to webpack config
 */
export function configureScssImporterForLess(webpackConfig: webpack.Configuration): webpack.Configuration {
  const { module: { rules = [] } = {} } = webpackConfig || {};
  return {
    ...webpackConfig,
    module: {
      ...webpackConfig.module,
      rules: rules.map(rule => {
        if (hasLoader(rule, 'less-loader')) {
          if (!isVersion6()) throw new Error('less-scss-importer plugin is only compatible with less-loader vesion 6.0.0 or above.');
          return modifyLessLoaderOptions(rule);
        } else {
          return rule;
        }
      })
    }
  };
}

/**
* Adds lessImporter to loader's lessOptions
*/
function modifyLessLoaderOptions(rule: webpack.RuleSetRule): webpack.RuleSetRule {
  return modifyLoaderOptions(rule, 'less-loader', (options = {}) => {
    if (typeof options === 'string') throw new Error('less-loader options of type string is not supported');
    const lessOptions = options.lessOptions ?? {};
    return {
      ...options,
      lessOptions: (loaderContext: LoaderContext) => {
        const currentLessOptions: Less.Options = typeof lessOptions === 'function' ? lessOptions(loaderContext) : lessOptions;
        const plugins = (currentLessOptions.plugins ?? []).concat(scssImporterPluginWebpack(loaderContext));
        return { ...currentLessOptions, plugins };
      }
    };
  });
}

// lessOptions as a function was introduced in version 6.0.0 of less-loader
const isVersion6 = memoize(() => {
  const lessLoaderPackage = require('less-loader/package.json');
  return semver.gte(lessLoaderPackage.version, '6.0.0');
});
