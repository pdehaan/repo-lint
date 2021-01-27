const lib = require("../lib");

module.exports = class DependenciesRules {
  constructor(files = []) {
    this.files = files;

    return {
      dependabot_files: this.dependabotFiles,
      greenkeeper_files: this.greenkeeperFiles,
      renovate_files: this.renovateFiles,
    };
  }

  get dependabotFiles() {
    return lib.findFileByName(this.files, "dependabot.yml");
  }

  get greenkeeperFiles() {
    // NOTE: https://github.com/mozilla/FirefoxColor/commit/df4ff6c1c057ac34737bad5e47b6c5a83712893d
    // return lib.findFileByPath(this.files, "??");
  }

  get renovateFiles() {
    return lib.findFileByPath(this.files, "renovate.json");
  }
};
