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
  verbose: { type: "boolean", default: false },
  "module-root": { type: "string" },
}

type Argv = {
  input: string
  nocolor: boolean
  verbose: boolean
  "module-root": string
}

export const handler = async (argv: Argv) => {
  const file = argv.input

  const stat = await fs.promises.stat(file)
  if (!stat.isFile()) {
    console.error(`The input is not file: ${JSON.stringify(file)}`)
    process.exit(1)
  }

  const dir = argv["module-root"] || path.dirname(file)
  const pieces = await Piece.pieces_from_directory(dir)
  const project = Project.init()
  const results = Project.from_pieces(project, pieces)

  if (argv.verbose) {
    print_verbose_output(results, file)
  } else {
    print_output(results, file)
  }
}

function print_verbose_output(
  results: Array<Piece.Piece & { output: string }>,
  file: string
): void {
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

  console.log(`// Output of the specified file: ${JSON.stringify(file)}`)
  console.log()

  print_output(results, file)
}

function print_output(
  results: Array<Piece.Piece & { output: string }>,
  file: string
): void {
  for (const result of results) {
    if (
      result.source.kind === "Piece.Source.file" &&
      path.resolve(result.source.file) === path.resolve(file)
    ) {
      console.log(result.output)
    }
  }
}
