import * as Project from "../project"
import * as Piece from "../piece"
import * as Mod from "../mod"
import * as Top from "../top"

export function from_pieces(pieces: Array<Piece.Piece>): Project.Project {
  const project = Project.init()
  for (const piece of pieces) {
    Project.call_with_mod(project, piece.modpath, (mod) => {
      const output = Top.run(project, mod, piece.tops)
      // TODO how to handle output?
      // console.log(output)
    })
  }

  return project
}
