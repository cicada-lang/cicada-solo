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

    function through_tops(
      f: (mod: Mod.Mod, top: Top.Top, piece: Result) => void
    ): void {
      for (const piece of results) {
        for (const top of piece.tops) {
          Project.call_with_mod(project, piece.modpath, (mod) =>
            f(mod, top, piece)
          )
        }
      }
    }

    through_tops((mod, top) => Top.define(project, mod, top))
    through_tops((mod, top) => Top.check(mod, top))
    through_tops((mod, top, piece) => {
      piece.output += Top.output(mod, top)
    })

    return results
  } catch (error) {
    if (error instanceof Trace.Trace) {
      console.error(Trace.repr(error, Exp.repr))
      process.exit(1)
    }

    throw error
  }
}
