const types = require("util").types;

// const makeSync = require("make-synchronous");
const { NpmPackageJsonLint } = require("npm-package-json-lint");

// const fetchFileSync = makeSync(async (url = "") => {
//   const axios = require("axios");
//   return axios.get(url).then((res) => res.data);
// });

const axios = require("axios");

module.exports = {
  /**
   * Logs an error to stderr and sets a `process.exitCode` to optionally fail the build.
   * @param {string} namespace
   * @param {string} msg
   * @param {number} code
   */
  error(namespace, msg, code = 1) {
    this.warning(namespace, msg);
    process.exitCode = code;
  },

  /**
   * Logs a warning to stderr.
   * @param {string} namespace
   * @param {string} msg
   */
  warning(namespace, msg) {
    process.stderr.write(`[${namespace}] ${msg}\n`);
  },

  /**
   * Searches for a specific file name in a repo. This only checks the file's name, and not the path, so the file can appear at any level.
   * @param {array<object>} files An array of file objects from the specified GitHub repo/branch.
   * @param {string} filename A filename to search for in the specified `files[]` array.
   */
  findFileByName(files = [], filename = "") {
    if (types.isRegExp(filename)) {
      return files.filter((file) => filename.test(file.name.toLowerCase()));
    }
    return files.filter(
      (file) => filename.toLowerCase() === file.name.toLowerCase()
    );
  },

  /**
   * Searches for a specific file path in a repo. This only checks for the file in a specific path.
   * @param {array<object>} files An array of file objects from the specified GitHub repo/branch.
   * @param {*} filepath A file path to search for the specified `files[]` array.
   */
  findFileByPath(files = [], filepath = "") {
    if (types.isRegExp(filepath)) {
      return files.filter((file) => filepath.test(file.path.toLowerCase()));
    }
    return files.filter(
      (file) => filepath.toLowerCase() === file.path.toLowerCase()
    );
  },

  /**
   * Syncronous network requests are never a good idea, yet here we are...
   * @param {string} url A URL to fetch.
   * @returns {object} Returns the specified content (an object if it's a JSON payload or a string).
   */
  async fetchFile(url = "", opts={}) {
    const res = await axios.get(url, opts);
    return res.data;
  },
};
