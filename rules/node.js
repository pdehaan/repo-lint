const axios = require("axios");
const { NpmPackageJsonLint } = require("npm-package-json-lint");

const lib = require("../lib");

module.exports = class NodeRules {
  constructor(files = []) {
    this.files = files;

    return {
      eslint_files: this.eslintFiles,
      packagejson_files: this.packageJsonFiles,
      node_modules_files: this.nodeModulesFiles,
    };
  }

  get eslintFiles() {
    const hasPackageJson = !!this.packageJsonFiles.length;
    const res = lib.findFileByName(this.files, /^\.eslint/i);
    if (hasPackageJson && !res.length) {
      lib.warning(
        "NODE",
        "package.json files found, but no ESLint configs found."
      );
    }
    return res;
  }

  get packageJsonFiles() {
    return Promise.resolve()
      .then(async () => {
        const res = lib.findFileByName(this.files, "package.json");
        for (const file of res) {
          const pkg = await lib.fetchFile(file.raw_url);
          file.pkg = pkg;
          file.lint = lintPackageJson(pkg, file.path);
        }
        return res;
      });

    // const res = lib.findFileByName(this.files, "package.json");
    // for (const file of res) {
    //   const pkg = lib.fetchPackageJson(file.raw_url, file.path);
    //   file.payload = pkg.payload;
    //   file.lint = pkg.lint;
    // }
    // return res;
  }

  get nodeModulesFiles() {
    return lib.findFileByName(this.files, /node_modules/);
  }
};


function lintPackageJson(pkg = {}, filepath = "") {
  const linter = new NpmPackageJsonLint({
    packageJsonObject: pkg,
    packageJsonFilePath: filepath,
    config: {
      extends: "npm-package-json-lint-config-default",
    },
    rules: {
      "license-type": "error",
      "require-author": "error",
      "valid-values-license": ["error", [
        "MPL-2.0"
      ]],
    },
  });
  const lint = linter.lint().results.shift();
  delete lint.filepath;
  delete lint.ignored;
  return lint;
}