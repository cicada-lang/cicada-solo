#!/usr/bin/env node

const pkg = require("../package.json")
const cli = require("../lib/lang1.1/cli/cli")

cli.run({
  version: pkg.version,
})
