import webpack, { Configuration, Stats } from 'webpack';

export function compileWebpack(config: Configuration): Promise<Stats | undefined> {
  const compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err);
      if (stats !== undefined && stats.hasErrors()) {
        reject(new Error(stats.toJson().errors?.map(err => err.details).join('\n')));
      }
      resolve(stats);
    });
  });
};
