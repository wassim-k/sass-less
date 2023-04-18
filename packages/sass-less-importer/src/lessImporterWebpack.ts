import { normalize } from 'path';
import { LoaderContext } from 'webpack';
import { legacyLessImporter, lessImporter } from './lessImporter';

const resolveConfig = {
  mainFields: ['less', 'style', 'main', '...'],
  mainFiles: ['_index', 'index', '...'],
  extensions: ['.less'],
};

export function lessImporterWebpack(loaderContext: LoaderContext<any>) {
  const { resourcePath, getResolve } = loaderContext as any;
  const resolve = getResolve(resolveConfig);
  const addNormalizedDependency = getAddNormalizedDependency(loaderContext);
  return lessImporter(resourcePath, resolve, addNormalizedDependency);
}

export function legacyLessImporterWebpack(loaderContext: LoaderContext<any>) {
  const { resourcePath, getResolve } = loaderContext as any;
  const resolve = getResolve(resolveConfig);
  const addNormalizedDependency = getAddNormalizedDependency(loaderContext);
  return legacyLessImporter(resourcePath, resolve, addNormalizedDependency);
}

// node-sass returns POSIX paths
function getAddNormalizedDependency(loaderContext: LoaderContext<any>) {
  return (file: string) => loaderContext.addDependency(normalize(file));
}
