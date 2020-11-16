import * as Piece from "../piece"
import * as ut from "../../ut"
import path from "path"

async function test(): Promise<void> {
  const file = path.resolve(__dirname, "../../../examples/lang3/list.cic")
  const piece = await Piece.from_file(file)
  ut.assert_equal(piece.modpath, {
    prefix: ["cicada"],
    name: "datatype",
  })
}

test()
