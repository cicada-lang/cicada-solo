import { Library } from "../../library"
import { LocalFileResource } from "../../library/file-resources"
import { FakeFileResource } from "../../library/file-resources"
import { DefaultRunner } from "../runners"
import { Repl } from "../repl"
import find_up from "find-up"
import Path from "path"
import fs from "fs"

export const command = "repl"
export const description = "Run interactive REPL"
export const builder = {}

type Argv = {}

export const handler = async (argv: Argv) => {
  const repl = new Repl()
  await repl.run()
  return
}
