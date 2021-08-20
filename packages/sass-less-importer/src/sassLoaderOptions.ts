import { Options } from 'sass-loader';
import semver from 'semver';
import type webpack from 'webpack';
import { lessImporterWebpack } from './lessImporterWebpack';
type LoaderContext = webpack.loader.LoaderContext;

// sass-loader v7
export function getSassLoaderOptions7<T extends { [key: string]: any }>(loaderContext: LoaderContext, options: T,): T {
    return ensureSourceMap({
        ...options,
        importer: [lessImporterWebpack(loaderContext)].concat(options.importer ?? [])
    });
}

// sass-loader v8
export function getSassLoaderOptions8(options: Options): Options {
    const sassOptions = options.sassOptions ?? {};
    return ensureSourceMap({
        ...options,
        sassOptions: (loaderContext: LoaderContext) => {
            const currentSassOptions = typeof sassOptions === 'function' ? sassOptions(loaderContext) : sassOptions;
            const importer = [lessImporterWebpack(loaderContext)].concat(currentSassOptions.importer ?? []);
            return { ...currentSassOptions, importer };
        }
    });
}

// https://github.com/sass/dart-sass/issues/922
function ensureSourceMap<T extends { [k: string]: any }>(options: T): T {
    return supportsSourceMap(options.implementation)
        ? options :
        { ...options, sourceMap: false };
}

function supportsSourceMap(implementation: { info: string } | undefined): boolean {
    const [name, version]: Array<string | undefined> = implementation?.info?.split('\t') ?? [];
    if (!name) return false;
    if (name === 'node-sass') return true;
    if (name !== 'dart-sass' || !version) return false;
    if (version === 'worker') return true;
    try {
        return semver.gte(version, '1.24.4');
    } catch {
        return false;
    }
}
