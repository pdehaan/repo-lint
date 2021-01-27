const lib = require("../lib");

module.exports = class PythonRules {
  constructor(files = []) {
    this.files = files;

    return {
      flake8_files: this.flake8Files,
      requirementstxt_files: this.requirementsTxtFiles,
    };
  }

  get flake8Files() {
    return lib.findFileByName(this.files, ".flake8");
  }

  get requirementsTxtFiles() {
    return lib.findFileByName(this.files, "requirements.txt");
  }
};
