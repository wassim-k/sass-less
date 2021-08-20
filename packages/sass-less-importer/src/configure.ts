import semver from 'semver';
import type { Configuration, RuleSetLoader, RuleSetRule } from 'webpack';
import { hasLoader, memoize, modifyLoader, modifyLoaderOptions } from '../../webpack-utils';
import { getSassLoaderOptions8 } from './sassLoaderOptions';

/**
 * Add lessImporter to webpack config
 */
export function configureLessImporterForSass(webpackConfig: Configuration): Configuration {
  const { module: { rules = [] } = {} } = webpackConfig || {};
  return {
    ...webpackConfig,
    module: {
      ...webpackConfig.module,
      rules: rules.map(rule => hasLoader(rule, 'sass-loader')
        ? isVersion7()
          ? addLessImporterLoader(rule, './loader-v7')
          : hasDependencyIssue()
            ? addLessImporterLoader(rule, './loader')
            : modifySassLoaderOptions(rule)
        : rule
      )
    }
  };
}

/**
* Replaces sass-loader with sass-less-importer-loader
*/
function addLessImporterLoader(rule: RuleSetRule, loaderPath: string): RuleSetRule {
  return modifyLoader(rule, 'sass-loader', loader => {
    const { options = {} }: RuleSetLoader = typeof loader === 'string' ? { loader } : loader;
    if (typeof options === 'string') throw new Error('sass-loader with options of type string is not supported');
    return {
      loader: require.resolve(loaderPath),
      options
    };
  });
}

/**
* Adds lessImporter to loader's sassOptions
*/
function modifySassLoaderOptions(rule: RuleSetRule): RuleSetRule {
  return modifyLoaderOptions(rule, 'sass-loader', (options = {}) => {
    if (typeof options === 'string') throw new Error('sass-loader options of type string is not supported');
    return getSassLoaderOptions8(options);
  });
}

// sassOptions was introduced in version 8.0.0 of sass-loader
const isVersion7 = memoize(() => {
  const pkg = require('sass-loader/package.json');
  return semver.lt(pkg.version, '8.0.0');
});

// sass's compilation result.stats.includedFiles normally has absolute paths for all imported files, regardless of how they were imported.
// but when a custom importer is used, the custom import path is included as is in its relative form
// sass-loader calls webpack.loaderContext.addDependency on all result.stats.includedFiles
// but there seems to be an issue with webpack's dependency resolution when addDependency is called with a relative path which causes extra compilations
// until this issue is fixed, we can't simply override sassLoader.options.sassOptions but instead have to include a wrapper loader as done above.
const hasDependencyIssue = memoize(() => {
  const pkg = require('webpack/package.json');
  return semver.lt(pkg.version, '5.0.0');
});
