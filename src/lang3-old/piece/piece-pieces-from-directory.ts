import * as Piece from "../piece"
import readdirp from "readdirp"

export async function pieces_from_directory(
  dir: string
): Promise<Array<Piece.Piece>> {
  const pieces = []
  for await (const entry of readdirp(dir)) {
    if (entry.path.endsWith(".cic")) {
      pieces.push(await Piece.from_file(entry.fullPath))
    }
  }
  return pieces
}
