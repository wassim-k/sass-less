import { normalize } from 'path';
import type webpack from 'webpack';
import { lessImporter } from './lessImporter';

export function lessImporterWebpack(loaderContext: webpack.loader.LoaderContext) {
  const { resourcePath, addDependency, getResolve } = loaderContext as any;

  const resolve = getResolve({
    mainFields: ['less', 'style', 'main', '...'],
    mainFiles: ['_index', 'index', '...'],
    extensions: ['.less'],
  });

  // node-sass returns POSIX paths
  const addNormalizedDependency = (file: string) => addDependency.call(loaderContext, normalize(file));

  return lessImporter(resourcePath, resolve, addNormalizedDependency);
}
