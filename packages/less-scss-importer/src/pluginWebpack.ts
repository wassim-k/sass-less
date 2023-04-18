import { normalize } from 'path';
import { LoaderContext } from 'webpack';
import { scssImporterPlugin } from './plugin';

export const scssImporterPluginWebpack = (loaderContext: LoaderContext<any>): Less.Plugin => {
    const { addDependency, getResolve } = loaderContext as any;

    const resolve = getResolve({
        mainFields: ['less', 'style', 'main', '...'],
        mainFiles: ['_index', 'index', '...'],
        extensions: ['.scss'],
    });

    const addNormalizedDependency = (file: string) => addDependency.call(loaderContext, normalize(file));

    return scssImporterPlugin(resolve, addNormalizedDependency);
};
