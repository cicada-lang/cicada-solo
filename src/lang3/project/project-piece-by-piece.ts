import * as Project from "../project"
import * as Piece from "../piece"
import * as Mod from "../mod"
import * as Top from "../top"
import * as Exp from "../exp"
import * as Trace from "../../trace"

export function piece_by_piece(
  project: Project.Project,
  piece: Piece.Piece
): string {
  return Project.call_with_mod(project, piece.modpath, (mod) => {
    try {
      return Top.run(project, mod, piece.tops)
    } catch (error) {
      if (error instanceof Trace.Trace) {
        const trace = error
        console.error(Trace.repr(trace, Exp.repr))
        process.exit(1)
      }

      throw error
    }
  })
}
