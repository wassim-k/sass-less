import { Options } from 'sass-loader';
import { LoaderContext } from 'webpack';
import { legacyLessImporterWebpack, lessImporterWebpack } from './lessImporterWebpack';

export function buildSassLoaderOptions(options: Options): Options {
    const sassOptions = options.sassOptions ?? {};
    const isModernApi = 'api' in options && options.api === 'modern';
    return {
        ...options,
        sassOptions: (loaderContext: LoaderContext<any>) => {
            const currentSassOptions = typeof sassOptions === 'function' ? sassOptions(loaderContext) : sassOptions;
            return isModernApi
                ? {
                    ...currentSassOptions,
                    importers: [lessImporterWebpack(loaderContext)].concat((currentSassOptions as any).importers ?? [])
                }
                : {
                    ...currentSassOptions,
                    importer: [legacyLessImporterWebpack(loaderContext)].concat((currentSassOptions as any).importer ?? [])
                }
        }
    };
}
