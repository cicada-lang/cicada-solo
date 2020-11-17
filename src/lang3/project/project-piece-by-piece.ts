import * as Project from "../project"
import * as Piece from "../piece"
import * as Top from "../top"
import * as Exp from "../exp"
import * as Trace from "../../trace"

export function piece_by_piece(
  project: Project.Project,
  piece: Piece.Piece
): string {
  try {
    return Project.call_with_mod(project, piece.modpath, (mod) =>
      Top.run_tops(project, mod, piece.tops)
    )
  } catch (error) {
    if (error instanceof Trace.Trace) {
      console.error(Trace.repr(error, Exp.repr))
      process.exit(1)
    }

    throw error
  }
}
