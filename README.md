# repo-lint

> Linting GitHub Repos for Fun and Profit.

## INSTALL

```sh
npm i pdehaan/repo-lint
```

## USAGE

### API

```js
const github = require("repo-linter");

main("github_org_name", "github_repo_name");

async function main(owner, repo) {
  const res = await github.getRepo({ owner, repo });
  console.log(JSON.stringify(res, null, 2));
}
```

This will return a super large JSON blob of data from the GitHub `/repos/{owner}/{repo}` and `/repos/{owner}/{repo}/git/trees/{default_branch}?recursive=1` APIs.
We also add a bit of magic by scanning the array of files in the GitHub repo for missing README.md files, CODE_OF_CONDUCT.md files, package.json files, .eslint* files, etc.
