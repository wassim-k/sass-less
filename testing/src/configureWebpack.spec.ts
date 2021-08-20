import { configureScssImporterForLess } from 'less-scss-importer';
import path from 'path';
import rimraf from 'rimraf';
import { configureLessImporterForSass } from 'sass-less-importer';
import type { Configuration } from 'webpack';
import { compileWebpack } from './helpers/compileWebpack';

describe('configureWebpack', () => {

  const outputPath = path.join(__dirname, '../out');

  afterAll(() => rimraf.sync(outputPath));

  it('can load scss vars into less using webpack & import less variables into scss', async () => {
    let config: Configuration = {
      mode: 'development',
      context: path.resolve(__dirname, '../data'),
      entry: './index.ts',
      output: {
        path: outputPath
      },
      module: {
        rules: [
          {
            test: /\.(js|.ts)$/,
            loader: 'ts-loader'
          },
          {
            test: /\.less$/,
            use: [
              'raw-loader',
              {
                loader: 'less-loader',
                options: {
                  lessOptions: {
                    javascriptEnabled: true
                  }
                }
              }
            ]
          },
          {
            test: /\.scss$/,
            use: [
              'raw-loader',
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: true
                }
              }
            ]
          }
        ]
      }
    };

    config = [
      configureLessImporterForSass,
      configureScssImporterForLess
    ].reduce((acc, fn) => fn(acc), config)

    const stats = await compileWebpack(config);
    const json = stats.toJson();
    const testLessOutput = json.modules?.[1]?.source;
    const testScssOutput = json.modules?.[2]?.source;
    expect(testLessOutput).toContain('.test-less {\\n  background-color: #f594a7;\\n  border-color: #f37c94;\\n}');
    expect(testScssOutput).toContain('.test-scss {\\n  background-color: #f594a7;\\n  border-color: #f37c94;\\n}');
  }, 10000);
});
