#!/usr/bin/env node
const program = require("commander");
const { exec } = require('child_process');
const Deal = require("mn-utils/deal");
const pkg = require("./package.json");

program
  .version(pkg.version, '-v, --version')
  .option("-l, --link [link]", "set deb package download link");

program.on("--help", () => {
  console.log("");
  console.log("Example:");
  console.log("");
  console.log("$ mnpkg --link http://archive.ubuntu.com/ubuntu/pool/universe/libs/libsoxr/libsoxr0_0.1.2-1_amd64.deb");
});

program.parse(process.argv);

const { link } = program;

const run = expression => new Deal((resolve, reject) => {
  exec(expression, (error, stdout, stderr) => {
    if (error) {
      reject(error);
      return;
    }
    stdout && console.log(stdout);
    stderr && console.error(stderr);
    resolve();
  });
});

const link_parts = link.split('/');
const name = link_parts[link_parts.length - 1];
const path = './' + name;

run(`wget ${link}`)
  .then(() => run(`dpkg -i ${path}`))
  .then(
    () => console.log(`Installed ${name}`),
    e => console.error(`${e}`)
  )
  .finally(() => run(`rm -f ${path}`).finally());
