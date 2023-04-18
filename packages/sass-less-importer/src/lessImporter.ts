import path, { basename } from 'path';
import { Importer, ImporterResult } from 'sass';
import { fileURLToPath, pathToFileURL } from 'url';
import { compileScssVariables } from './compileScssVariables';

export function lessImporter(
  resourcePath: string,
  resolve: (...args: Array<string>) => Promise<string>,
  addDependency: (file: string) => void = () => void 0
): Importer {
  return {
    canonicalize(url, _options) {
      return pathToFileURL(url);
    },
    load: async (canonicalUrl: URL): Promise<ImporterResult | null> => {
      const baseDirectory = path.dirname(resourcePath);
      const filePath = fileURLToPath(canonicalUrl);
      const leafName = basename(filePath);
      const file = await resolver([`./${leafName}`, filePath], baseDirectory, resolve);
      if (isLessFile(file)) {
        return await compileScssVariables(file, handleResult(addDependency, file))
          .then((contents): ImporterResult => ({ contents, syntax: 'scss', sourceMapUrl: canonicalUrl }))
          .catch(error => error)
      } else {
        return null; // pass file to other importers
      }
    },
  };
}

export function legacyLessImporter(
  resourcePath: string,
  resolve: (...args: Array<string>) => Promise<string>,
  addDependency: (file: string) => void = () => void 0
) {
  return (url: string, prev: string, done: (value: any) => void) => {
    const baseDirectory = path.dirname(prev === 'stdin' ? resourcePath : prev);
    resolver([`./${url}`, url], baseDirectory, resolve)
      .then(file => isLessFile(file)
        ? compileScssVariables(file, handleResult(addDependency, file))
          .then(contents => ({ contents }))
          .catch(error => error)
        : null /* pass file to other importers */)
      .then(done);
  };
}

function handleResult(addDependency: (file: string) => void, lessPath: string) {
  addDependency(lessPath);

  return (error: Less.RenderError | undefined, output: Less.RenderOutput | undefined) => {
    if (error?.filename) addDependency(error?.filename);
    output?.imports.forEach(addDependency);
  };
};

function resolver(urls: Array<string>, baseDirectory: string, resolve: (...args: Array<string>) => Promise<string>): Promise<string | undefined> {
  const [url, ...rest] = urls;
  return resolve(baseDirectory, url)
    .catch(() => urls.length > 0 ? resolver(rest, baseDirectory, resolve) : undefined)
}

function isLessFile(file: string | undefined): file is string {
  return typeof file === 'string' && path.extname(file) === '.less';
}
