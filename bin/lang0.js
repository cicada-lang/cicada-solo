#!/usr/bin/env node

const pkg = require("../package.json")
const cli = require("../lib/lang0/cli/cli")

cli.run({
  version: pkg.version,
})
