const lib = require("../lib");

module.exports = class FileRules {
  constructor(files = []) {
    this.files = files;
    this.NAMESPACE = "FILES";

    return {
      codeofconduct_files: this.codeOfConductFiles,
      codeowners_files: this.codeownersFiles,
      contributing_files: this.contributingFiles,
      license_files: this.licenseFiles,
      readme_files: this.readmeFiles,
      //
      large_files: this.largeFiles,
      suspicious_permissions_files: this.suspiciousPermissionsFiles,
    };
  }

  get codeOfConductFiles() {
    const res = lib.findFileByPath(this.files, "CODE_OF_CONDUCT.md");
    if (!res.length) {
      lib.error(this.NAMESPACE, "No /CODE_OF_CONDUCT.md file found.");
    }
    return res;
  }

  get readmeFiles() {
    const res = lib.findFileByPath(this.files, "README.md");
    if (!res.length) {
      lib.error(this.NAMESPACE, "No /README.md file found.");
    }
    return res;
  }

  get codeownersFiles() {
    return lib.findFileByPath(this.files, "CODEOWNERS");
  }

  get contributingFiles() {
    const res = lib.findFileByName(this.files, "CONTRIBUTING.md");
    if (!res.length) {
      lib.warning(this.NAMESPACE, "No CONTRIBUTING.md file found.");
    }
    return res;
  }

  get licenseFiles() {
    const res = lib.findFileByPath(this.files, "LICENSE");
    if (!res.length) {
      lib.error(this.NAMESPACE, "No /LICENSE file found.");
    }
    return res;
  }

  get largeFiles() {
    return this.files
      .filter((file) => file.type === "blob")
      .sort((a, b) => b.size - a.size)
      .slice(0, 10);
  }

  get suspiciousPermissionsFiles() {
    return this.files.filter((file) => {
      return (
        file.type === "blob" &&
        !file.mode.endsWith(644) &&
        !file.name.endsWith(".sh")
      );
    });
  }
};
