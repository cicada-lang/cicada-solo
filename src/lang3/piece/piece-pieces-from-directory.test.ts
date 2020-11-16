import * as Piece from "../piece"
import * as ut from "../../ut"
import path from "path"

async function test(): Promise<void> {
  const dir = path.resolve(__dirname, "../../../examples/lang3/")
  const pieces = await Piece.pieces_from_directory(dir)
  // console.log(pieces)
}

test()
