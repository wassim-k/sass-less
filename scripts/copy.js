const { copyRecursiveSync, deleteFolderRecursive } = require('./utils');
const path = require('path');

if (process.argv.length < 2) throw new Error('Invalid arguments');
const args = process.argv.slice(2);

const srcs = args.slice(0, args.length - 1);
const dest = args[args.length - 1];
const destPath = path.resolve(dest);

for (const src of srcs) {
  const srcPath = path.resolve(src);
  const srcName = path.basename(srcPath);
  const target = path.resolve(`${destPath}/${srcName}`);
  deleteFolderRecursive(target)
  console.log(`${srcPath} => ${target}`);
  copyRecursiveSync(srcPath, target);
}
