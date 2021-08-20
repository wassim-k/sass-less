import loaderUtils from 'loader-utils';
import path from 'path';
import sassLoader from 'sass-loader';
import type webpack from 'webpack';
import { getSassLoaderOptions7 } from './sassLoaderOptions';

/*
 * sass-loader v7
 */
export default function (this: webpack.loader.LoaderContext, ...args: Array<any>) {
    const options = loaderUtils.getOptions(this) ?? {};
    const addDependency = this.addDependency.bind(this);
    const loaderContext = {
        ...this,
        query: getSassLoaderOptions7(this, options),
        addDependency: (file: string) => {
            if (path.isAbsolute(file)) {
                addDependency(file);
            }
        }
    };
    return sassLoader.apply(loaderContext, args as any);
}
