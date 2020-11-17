import * as Modpath from "../../modpath"
import * as Project from "../../project"
import * as Piece from "../../piece"
import fs from "fs"
import path from "path"
import strip_ansi from "strip-ansi"

export const command = "run <input>"
export const description = "Run a file"
export const builder = {
  nocolor: { type: "boolean", default: false },
}

type Argv = {
  input: string
  nocolor: boolean
}

export const handler = async (argv: Argv) => {
  const stat = await fs.promises.stat(argv.input)
  const dir = stat.isDirectory() ? argv.input : path.dirname(argv.input)
  const pieces = await Piece.pieces_from_directory(dir)
  const project = Project.init()
  const results = Project.from_pieces(project, pieces)
  for (const result of results) {
    if (result.modpath) {
      console.log(`// @module ${Modpath.repr(result.modpath)}`)
    }
    if (result.source.kind === "Piece.Source.file") {
      console.log(`// @file ${JSON.stringify(result.source.file)}`)
    }
    if (result.source.kind === "Piece.Source.repl") {
      console.log(`// @repl`)
    }
    console.log()
    console.log(result.output)
  }
}
