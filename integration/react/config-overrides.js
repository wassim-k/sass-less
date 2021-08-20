const { configureLessImporterForSass } = require('sass-less-importer');

module.exports = {
  webpack: function (config, env) {
    return configureLessImporterForSass(config);
  }
};
