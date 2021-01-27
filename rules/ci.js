const lib = require("../lib");

module.exports = class CIRules {
  constructor(files = []) {
    this.files = files;

    return {
      circleci_files: this.circleciFiles,
      githubactions_files: this.githubActionsFiles,
      travisci_files: this.travisciFiles,
      taskcluster_files: this.taskclusterFiles,
    };
  }

  get circleciFiles() {
    return lib.findFileByPath(this.files, /^\.circleci\//);
  }

  get githubActionsFiles() {
    return lib.findFileByPath(this.files, /^\.github\/workflows\//);
  }

  get travisciFiles() {
    const res = lib.findFileByPath(this.files, /\.travis\.ya?ml/);
    if (res.length) {
      const msg = res.map((file) => file.path).join(", ");
      lib.error(
        `CI`,
        `Travis-CI usage has been deprecated. Please use Circle-CI or GitHub Actions. Found: ${msg}`
      );
    }
    return res;
  }

  get taskclusterFiles() {
    return lib.findFileByName(this.files, ".taskcluster.yml");
  }
};
