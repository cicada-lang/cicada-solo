import * as Syntax from "../../syntax"
import * as Value from "../../value"
import * as Top from "../../top"
import * as Exp from "../../exp"
import * as Ctx from "../../ctx"
import * as Env from "../../env"
import * as Mod from "../../mod"
import * as Project from "../../project"
import * as Piece from "../../piece"
import * as Trace from "../../../trace"
import * as pt from "../../../partech"
import fs from "fs"
import path from "path"
import strip_ansi from "strip-ansi"

export const command = "run <input>"
export const description = "Eval a file"
export const builder = {
  nocolor: { type: "boolean", default: false },
}

type Argv = {
  input: string
  nocolor: boolean
}

export const handler = async (argv: Argv) => {
  const file_stat = await fs.promises.stat(argv.input)
  const dir = file_stat.isDirectory() ? argv.input : path.dirname(argv.input)
  const pieces = await Piece.pieces_from_directory(dir)
  const project = Project.init()
  for (const piece of pieces) {
    const output = Project.piece_by_piece(project, piece)

    if (file_stat.isDirectory()) {
      console.log(output)
    }

    if (
      file_stat.isFile() &&
      piece.source.kind === "Piece.Source.file" &&
      path.resolve(argv.input) === path.resolve(piece.source.file)
    ) {
      console.log(output)
    }
  }
}
