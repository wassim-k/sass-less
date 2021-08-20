import { normalize } from 'path';
import type webpack from 'webpack';
import { scssImporterPlugin } from './plugin';

export const scssImporterPluginWebpack = (loaderContext: webpack.loader.LoaderContext): Less.Plugin => {
    const { addDependency, getResolve } = loaderContext as any;

    const resolve = getResolve({
        mainFields: ['less', 'style', 'main', '...'],
        mainFiles: ['_index', 'index', '...'],
        extensions: ['.scss'],
    });

    const addNormalizedDependency = (file: string) => addDependency.call(loaderContext, normalize(file));

    return scssImporterPlugin(resolve, addNormalizedDependency);
};
