#!/usr/bin/env node
const program = require("commander");
const { spawn } = require('child_process');
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

const run = (name, expressions) => new Deal((resolve, reject) => {
  spawn(name, expressions, { stdio: 'inherit' }).on('close', (code) => {
    if (code !== 0) {
      console.log(`process exited with code ${code}\n`);
      reject();
      return;
    }
    resolve();
  });
});

const link_parts = link.split('/');
const name = link_parts[link_parts.length - 1];
const path = './' + name;

run('wget', [ link ])
  .then(() => run('dpkg', [ '-i', path ]))
  .then(() => console.log(`Installed ${name}\n`))
  .finally(() => run('rm', [ '-f', path ]).finally());
