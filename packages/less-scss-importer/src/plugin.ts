import { CompileResult } from 'sass';
import { fileURLToPath } from 'url';
import { extractScssVariables } from './extractScssVariables';

const { FileManager } = require('less');

type Resolve = (...args: Array<string>) => Promise<string>;
type AddDependency = (file: string) => void;

interface File {
    filename: string;
    contents: string;
}

const SCSS_PROTOCOL = 'scss:';

export const scssImporterPlugin = (
    resolve: Resolve,
    addDependency?: AddDependency
): Less.Plugin => ({
    install: (less: any, _pluginManager: Less.PluginManager) => {
        const scssFileManager = new ScssFileManager(resolve, addDependency);
        less.environment.addFileManager(scssFileManager);
    }
});

class ScssFileManager extends FileManager {

    public constructor(
        public readonly resolve: Resolve,
        public readonly addDependency: AddDependency = () => void 0
    ) {
        super();
    }

    public supportsSync(_filename: string, _currentDirectory: string, _options: Less.Options, _environment: any): boolean {
        return false;
    }

    public supports(filename: string, _currentDirectory: string, _options: Less.Options, _environment: any): boolean {
        return filename.startsWith(SCSS_PROTOCOL);
    }

    public async loadFile(filename: string, currentDirectory: string, _options: Less.Options, _environment: any): Promise<File> {
        const file = await this.resolve(currentDirectory, filename.substring(SCSS_PROTOCOL.length));
        return {
            filename: file,
            contents: await compileLessVariables(file, this.addDependency)
        };
    }
}

export function compileLessVariables(file: string, addDependency: AddDependency) {

    const callback = (result: CompileResult) => result.loadedUrls.map(url => fileURLToPath(url)).forEach(addDependency);

    addDependency(file);

    return extractScssVariables(file, callback)
        .then(variables => Object.entries(variables)
            .map(([name, value]) => `@${name}: ${value};`)
            .join(''));
};
