import path from 'path';
import { extractLessVariables } from './extractLessVariables';

export function lessImporter(
  resourcePath: string,
  resolve: (...args: Array<string>) => Promise<string>,
  addDependency: (file: string) => void = () => void 0
) {

  function resolver(urls: Array<string>, baseDirectory: string): Promise<string | undefined> {
    const [url, ...rest] = urls;
    return resolve(baseDirectory, url)
      .catch(() => urls.length > 0 ? resolver(rest, baseDirectory) : undefined)
  }

  return (url: string, prev: string, done: (value: any) => void) => {
    const baseDirectory = path.dirname(prev === 'stdin' ? resourcePath : prev);
    resolver([`./${url}`, url], baseDirectory)
      .then(file => {
        return isLessFile(file)
          ? compileScssVariables(file, addDependency)
            .then(contents => ({ contents }))
            .catch(error => error)
          : null; // pass file to other importers
      })
      .then(done);
  };
}

function compileScssVariables(lessPath: string, addDependency: (file: string) => void) {

  function callback(error: Less.RenderError | undefined, output: Less.RenderOutput | undefined) {
    if (error?.filename) addDependency(error?.filename);
    output?.imports.forEach(addDependency);
  };

  addDependency(lessPath);

  return extractLessVariables(lessPath, callback)
    .then(variables => Object.entries(variables)
      .map(([name, value]) => `$${name}: ${value};`)
      .join(''));
};

function isLessFile(file: string | undefined): file is string {
  return typeof file === 'string' && path.extname(file) === '.less';
}
