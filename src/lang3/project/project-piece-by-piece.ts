import * as Project from "../project"
import * as Piece from "../piece"
import * as Mod from "../mod"
import * as Top from "../top"

export function piece_by_piece(
  project: Project.Project,
  piece: Piece.Piece
): string {
  return Project.call_with_mod(project, piece.modpath, (mod) =>
    Top.run(project, mod, piece.tops)
  )
}
