import * as Piece from "../piece"
import * as Top from "../top"
import * as Modpath from "../modpath"
import * as Syntax from "../syntax"
import fs from "fs"

export async function from_file(file: string): Promise<Piece.Piece> {
  const code = await fs.promises.readFile(file, "utf8")
  const source = Piece.Source.file(file, code)
  throw new Error("TODO")
}
