import * as Piece from "../piece"
import readdirp from "readdirp"
import fs from "fs"

export async function pieces_from_directory(
  dir: string
): Promise<Array<Piece.Piece>> {
  const pieces = []
  for await (const entry of readdirp(dir)) {
    pieces.push(await Piece.from_file(entry.fullPath))
  }
  return pieces
}
