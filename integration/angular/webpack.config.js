const { configureLessImporterForSass } = require('sass-less-importer');

module.exports = (config) => {
  const newConfig = configureLessImporterForSass(config);
  return newConfig;
};
