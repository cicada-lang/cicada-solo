#!/usr/bin/env node

const pkg = require("../package.json")
const cli = require("../lib/lang2/cli/cli")

cli.run({
  version: pkg.version,
})
