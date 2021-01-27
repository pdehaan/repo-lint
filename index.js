const github = require("./lib/github");

main("mozilla", "blurts-server");

async function main(owner, repo) {
  const $repo = await github.getRepo({ owner, repo });
  console.log(JSON.stringify($repo, null, 2));
}
