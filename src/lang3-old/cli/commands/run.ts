import * as Modpath from "../../modpath"
import * as Project from "../../project"
import * as Piece from "../../piece"
import fs from "fs"
import path from "path"

export const command = "run <input>"
export const description = "Run a file"
export const builder = {
  verbose: { type: "boolean", default: false },
  "module-root": { type: "string" },
}

type Argv = {
  input: string
  verbose: boolean
  "module-root": string
}

export const handler = async (argv: Argv) => {
  const file = argv.input
  if (!(await fs.promises.stat(file)).isFile()) {
    console.error(`The input must be a file: ${JSON.stringify(file)}`)
    process.exit(1)
  }

  const dir = argv["module-root"] || path.dirname(file)
  if (!(await fs.promises.stat(dir)).isDirectory()) {
    console.error(`The module root must be a directory: ${JSON.stringify(dir)}`)
    process.exit(1)
  }

  const pieces = await Piece.pieces_from_directory(dir)

  if (
    !pieces.find(
      (piece) =>
        piece.source.kind === "Piece.Source.file" &&
        path.resolve(piece.source.file) === path.resolve(file)
    )
  ) {
    pieces.push(await Piece.from_file(file))
  }

  const project = Project.init()
  const results = Project.from_pieces(project, pieces)

  if (argv.verbose) {
    report_verbose(results, file)
  } else {
    report(results, file)
  }
}

function report_verbose(
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

  report(results, file)
}

function report(
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
