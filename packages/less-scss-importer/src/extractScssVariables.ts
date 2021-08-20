import fs from 'fs';
import pify from 'pify';
import sass, { Result } from 'sass';
const gonzales = require('gonzales-pe');

export async function extractScssVariables(file: string, callback: (result: Result) => void) {
  const selector = '__VARIABLES__';
  const scssText = fs.readFileSync(file, 'utf-8');
  const variables = parseVariables(scssText);
  const rules = variables.map(variable => `${variable}: $${variable};`);
  const block = `${selector}{${rules.join('\n')}}`;
  const data = [scssText, block].join('\n');
  const result = await pify(sass.render)({ file, data });
  const css = result.css.toString();
  callback(result);
  return extractCssDeclerations(css, selector)
    .reduce((acc, [name, value]) => ({ ...acc, [name]: value }), {});
}

function parseVariables(scss: string) {
  const variables: Array<string> = [];
  const tree = gonzales.parse(scss, { syntax: 'scss' });
  tree.forEach('declaration', (decl: any) => {
    variables.push(decl.first('property').first('variable').first('ident').content);
  });
  return variables;
}

function extractCssDeclerations(css: string, selector: string) {
  const values: Array<[string, string]> = [];

  const tree = gonzales.parse(css, { rule: 'ruleset' });
  tree.forEach('ruleset', (ruleset: any) => {

    if (ruleset?.content[0]?.content[0]?.content[0]?.content !== selector) return;

    ruleset.content
      .find((c: any) => c.type === 'block')
      .traverseByType('declaration', (decl: any) => {
        values.push([
          decl.content.find((c: any) => c.type === 'property').toString(),
          decl.content.find((c: any) => c.type === 'value').toString()
        ]);
      })
  });

  return values;
}
