import webpack, { Configuration, Stats } from 'webpack';

export function compileWebpack(config: Configuration): Promise<Stats> {
  const compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err);
      if (stats.hasErrors()) reject(new Error(stats.toJson().errors.join('\n')));
      resolve(stats);
    });
  });
};
