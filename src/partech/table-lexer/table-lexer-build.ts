import * as TableLexer from "../table-lexer"
import { LexingError } from "../errors"
import * as Token from "../token"
import * as Span from "../span"
import * as ut from "../../ut"

export function build(present: any): TableLexer.TableLexer {
  if (present instanceof Array) {
    const table: Array<[string, RegExp]> = present.map(([label, pattern, flags]) => [
      label,
      new RegExp(pattern, flags),
    ])
    return TableLexer.create(table)
  } else {
    throw new Error(
      "Expecting present to be an Array.\n" +
        `present: ${JSON.stringify(present, null, 2)}`
    )
  }
}
