import * as Piece from "../piece"
import * as Top from "../top"
import * as Modpath from "../modpath"
import * as Syntax from "../syntax"
import * as pt from "../../partech"
import fs from "fs"
import process from "process"

export async function from_file(file: string): Promise<Piece.Piece> {
  const text = await fs.promises.readFile(file, "utf8")

  try {
    const source = Piece.Source.file(file, text)
    const parse = Syntax.parse_piece_with_souce(source)
    return parse(text)
  }  catch (error) {
    if (error instanceof pt.ParsingError) {
      let message = `file: ${file}\n`
      message += `${error.message}\n`
      message += pt.Span.report(error.span, text)
      console.error(message)
      process.exit(1)
    }

    throw error
  }

}
