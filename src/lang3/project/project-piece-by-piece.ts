import * as Project from "../project"
import * as Piece from "../piece"
import * as Top from "../top"
import * as Mod from "../mod"
import * as Exp from "../exp"
import * as Trace from "../../trace"

export function piece_by_piece(
  project: Project.Project,
  piece: Piece.Piece
): string {
  try {
    const mod = piece.modpath
      ? Project.lookup_mod_or_init(project, piece.modpath)
      : Mod.init()
    return Top.run_tops(project, mod, piece.tops)
  } catch (error) {
    if (error instanceof Trace.Trace) {
      console.error(Trace.repr(error, (exp) => exp.repr()))
      process.exit(1)
    }

    throw error
  }
}
