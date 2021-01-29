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
    const res = lib.findFileByPath(this.files, /^LICENSE(\.md)?$/i);
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
    return Promise.resolve()
      .then(async () => {
        const suspicious = [];
        for (const file of this.files) {
          // If we're a file, with execute permissions, but not a bash script...
          if (file.type === "blob" && file.permissions.endsWith("x") && !file.name.endsWith(".sh")) {
            let res = await lib.fetchFile(file.raw_url, { responseType: "text", transformResponse: undefined });
            if (!res.trim) {
              // HACK: Got an object??? https://github.com/axios/axios/issues/907
              res = JSON.stringify(res);
            }
            const firstLine = res.trim().split("\n").shift();
            const hasShebang = firstLine.startsWith("#!/usr/bin/env") || firstLine.startsWith("#!/bin/bash");
            // If we're an executable file _without_ a shebang? Fishy.
            if (!hasShebang) {
              suspicious.push(file);
            }
          }
        }
        return suspicious;
      });
    }
};
