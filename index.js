#!/usr/bin/env node
const program = require("commander");
const { exec } = require('child_process');
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

const run = expression => new Promise((resolve, reject) => {
  exec(expression, (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      reject(true);
      return;
    }
    console.log(stdout);
    console.error(stderr);
    resolve(true);
  });
});

const link_parts = link.split('/');
const path = './' + link_parts[link_parts.length - 1];

run(`wget ${link}`)
  .then(() => run(`dpkg -i ${path}`))
  .then(() => run(`rm -rf ${path}`));
