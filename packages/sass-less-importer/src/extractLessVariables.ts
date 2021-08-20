import fs from 'fs';
import less from 'less';

export async function extractLessVariables(
  lessPath: string,
  callback: (error: Less.RenderError | undefined, output: Less.RenderOutput | undefined) => void
): Promise<{ [key: string]: string }> {
  const selector = '__VARIABLES__';
  const lessText = fs.readFileSync(lessPath, 'utf8');
  const compileOptions = { filename: lessPath, javascriptEnabled: true };
  const parsed = await (less as any).parse(lessText, compileOptions);
  const variables = parsed.variables();
  const rules = Object.keys(variables).map((variable) => `${variable.slice(1)}: ${variable};`);
  const block = `${selector}{${rules.join('\n')}}`;
  return await new Promise((resolve, reject) => {
    less.render(
      [lessText, block].join('\n'),
      {
        ...compileOptions,
        plugins: [extractVariablesPlugin(resolve, selector)]
      },
      (error, output) => {
        callback(error, output);
        if (error) reject(error);
      });
  });
};

const extractVariablesPlugin = (resolve: (value: { [key: string]: string }) => void, selector: string): Less.Plugin => ({
  install: (_less: LessStatic, pluginManager: any) => {
    pluginManager.addVisitor({
      run: (evaldRoot: any) => {
        const rules: Array<any> = evaldRoot.rules
          .find((rule: any) => rule.isRuleset && rule?.selectors[0]?.elements[0]?.value === selector)
          .rules;
        const vars = rules.reduce<{ [key: string]: string }>((acc, { name, value }: any) => ({ ...acc, [name]: value.toCSS() }), {});
        evaldRoot.rules = []; // skip unnecessary conversion of AST to string
        resolve(vars);
      }
    });
  }
});
