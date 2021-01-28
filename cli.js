#!/usr/bin/env node

const meow = require("meow");

const github = require("./lib/github");
const pkg = require("./package.json");

const cmd = `npx pdehaan/${pkg.name}`;

const cli = meow(`
  Usage
    $ ${cmd} [options]

  Options
    --owner, -o  GitHub repo owner.
    --repo, -r   GitHub repo name.

  Examples
    $ ${cmd} --owner mozilla --repo experimenter
    $ ${cmd} -o mozilla -r bugbug
`,
  {
    flags: {
      owner: {
        type: "string",
        alias: "o",
        isRequired: true,
      },
      repo: {
        type: "string",
        alias: "r",
        isRequired: true,
      },
    },
  }
);

main(cli.flags);

async function main(flags) {
  const opts = {
    owner: flags.owner,
    repo: flags.repo,
  };
  const repo = await github.getRepo(opts);
  console.log(JSON.stringify(repo, null, 2));
}
