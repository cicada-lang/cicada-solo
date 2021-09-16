import { Library } from "../../library"
import { LocalFileResource } from "../../library/file-resources"
import { FakeFileResource } from "../../library/file-resources"
import { DefaultRunner } from "../runners"
import { Repl } from "../repl"
import find_up from "find-up"
import Path from "path"
import fs from "fs"

export const command = "repl [dir]"
export const description = "Run interactive REPL"
export const builder = {}

type Argv = {
  dir?: string
}

export const handler = async (argv: Argv) => {
  const dir = argv["dir"] || process.cwd()
  const repl = new Repl({ dir })
  await repl.run()
  return
}
