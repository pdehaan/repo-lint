const path = require("path");

const { request } = require("@octokit/request");
const mime = require("mime-types");
const { convert } = require("unix-permissions");

const { meta } = require("./meta");

const github = request.defaults({
  headers: {
    authorization: process.env?.GH_TOKEN,
  },
});

module.exports = {
  async getRepo(opts = {}) {
    const API_URL = "GET /repos/{owner}/{repo}";
    const { data: repo } = await github(API_URL, opts);
    // NOTE: A repo size is returned in KB, whereas file sizes are returned in bytes.
    repo.size = repo.size * 1024;
    repo.files = await this.getRepoFiles(opts, repo.default_branch);
    repo.meta = await meta(repo.files);
    return repo;
  },

  async getRepoFiles(opts = {}, default_branch = "master") {
    const API_URL =
      "GET /repos/{owner}/{repo}/git/trees/{default_branch}?recursive=1";
    const full_name = `${opts.owner}/${opts.repo}`;
    const base_html_url = (filepath) =>
      new URL(
        filepath,
        `https://github.com/${full_name}/blob/${default_branch}/`
      ).href;
    const base_raw_url = (filepath) =>
      new URL(
        filepath,
        `https://raw.githubusercontent.com/${full_name}/${default_branch}/`
      ).href;
    const res = await github(API_URL, { ...opts, default_branch });
    return res.data.tree.map((file) => {
      file.name = path.basename(file.path);
      if (file.type === "blob") {
        file.html_url = base_html_url(file.path);
        file.raw_url = base_raw_url(file.path);
        file.permissions = convert.stat(file.mode.slice(-3));
        file.ext = path.extname(file.name);
        file.mime = mime.lookup(file.path) || undefined;
      }
      delete file.url;
      return file;
    });
  },
};
