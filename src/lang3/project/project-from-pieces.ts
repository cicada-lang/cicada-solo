import * as Project from "../project"
import * as Piece from "../piece"
import * as Mod from "../mod"
import * as Top from "../top"
import * as Exp from "../exp"
import * as Trace from "../../trace"

type Result = Piece.Piece & {
  output: string
}

export function from_pieces(
  project: Project.Project,
  pieces: Array<Piece.Piece>
): Array<Result> {
  try {
    const results = pieces.map((piece) => ({ ...piece, output: "" }))
    loop_through_modpath_piece(project, results)
    loop_through_unnamed_piece(project, results)
    return results
  } catch (error) {
    if (error instanceof Trace.Trace) {
      console.error(Trace.repr(error, Exp.repr))
      process.exit(1)
    }

    throw error
  }
}

function loop_through_modpath_piece(
  project: Project.Project,
  results: Array<Result>
): void {
  for (const piece of results) {
    if (piece.modpath) {
      const mod = Project.lookup_mod_or_init(project, piece.modpath)
      for (const top of piece.tops) {
        Top.define(project, mod, top)
      }
    }
  }

  for (const piece of results) {
    if (piece.modpath) {
      const mod = Project.lookup_mod_or_init(project, piece.modpath)
      for (const top of piece.tops) {
        Top.check(mod, top)
      }
    }
  }

  for (const piece of results) {
    if (piece.modpath) {
      const mod = Project.lookup_mod_or_init(project, piece.modpath)
      for (const top of piece.tops) {
        piece.output += Top.output(mod, top)
      }
    }
  }
}

function loop_through_unnamed_piece(
  project: Project.Project,
  results: Array<Result>
): void {
  for (const piece of results) {
    if (!piece.modpath) {
      const mod = Mod.init()
      for (const top of piece.tops) {
        Top.define(project, mod, top)
      }
      for (const top of piece.tops) {
        Top.check(mod, top)
      }
      for (const top of piece.tops) {
        piece.output += Top.output(mod, top)
      }
    }
  }
}
