import type webpack from 'webpack';
import { LoaderContext } from 'webpack';
import { hasLoader, modifyLoaderOptions } from '../../webpack-utils';
import { scssImporterPluginWebpack } from './pluginWebpack';

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
        if (typeof rule !== 'string' && hasLoader(rule, 'less-loader')) {
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
      lessOptions: (loaderContext: LoaderContext<any>) => {
        const currentLessOptions: Less.Options = typeof lessOptions === 'function' ? lessOptions(loaderContext) : lessOptions;
        const plugins = (currentLessOptions.plugins ?? []).concat(scssImporterPluginWebpack(loaderContext));
        return { ...currentLessOptions, plugins };
      }
    };
  });
}
