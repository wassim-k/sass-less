import type { Configuration, RuleSetRule } from 'webpack';
import { hasLoader, modifyLoaderOptions } from '../../webpack-utils';
import { buildSassLoaderOptions } from './sassLoaderOptions';

/**
 * Add lessImporter to webpack config
 */
export function configureLessImporterForSass(webpackConfig: Configuration): Configuration {
  const { module: { rules = [] } = {} } = webpackConfig || {};
  return {
    ...webpackConfig,
    module: {
      ...webpackConfig.module,
      rules: rules.map(rule => typeof rule !== 'string' && hasLoader(rule, 'sass-loader')
        ? modifySassLoaderOptions(rule)
        : rule
      )
    }
  };
}

/**
* Adds lessImporter to loader's sassOptions
*/
function modifySassLoaderOptions(rule: RuleSetRule): RuleSetRule {
  return modifyLoaderOptions(rule, 'sass-loader', (options = {}) => {
    if (typeof options === 'string') throw new Error('sass-loader options of type string is not supported');
    return buildSassLoaderOptions(options);
  });
}
