import * as TableLexer from "../table-lexer"
import { LexingError } from "../errors"
import * as Token from "../token"
import * as Span from "../span"
import * as ut from "../../ut"

export type Present = Array<[string, string, string?]>

export function build(present: Present): TableLexer.TableLexer {
  return TableLexer.create(
    present.map(([label, pattern, flags]) => [
      label,
      new RegExp(pattern, flags),
    ])
  )
}
