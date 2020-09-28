import * as TableLexer from "../table-lexer"
import { LexingError } from "../errors"
import * as Token from "../token"
import * as Span from "../span"
// NOTE https://github.com/tc39/proposal-regexp-match-indices
import execWithIndices from "regexp-match-indices"

export function create(table: Array<[string, RegExp]>): TableLexer.TableLexer {
  for (const [label, regexp] of table) {
    if (regexp.global) {
      throw new Error(
        "Can not use RegExp with global property in TableLexer.\n" +
          `label: ${label}\n` +
          `regexp: ${regexp.toString()}\n`
      )
    }
  }

  return {
    table,

    lex(text: string): Array<Token.Token> {
      const tokens: Array<Token.Token> = new Array()

      let i = 0

      while (i < text.length) {
        const remain = text.slice(i)

        const result = match_table(remain, table)
        if (result !== undefined) {
          const { label, value, span, forword } = result
          i += forword
          tokens.push({
            label,
            value,
            span: Span.shift(span, i),
          })
        } else {
          throw new LexingError(
            "All regexp in table fail to match remaining input.\n" +
              `index: ${i}\n` +
              `remain: ${remain.slice(0, 200)} ...\n` +
              `labels: ${table.map(([label]) => label).join(", ")}\n`
          )
        }
      }

      return tokens
    },
  }
}

function match_table(
  text: string,
  table: Array<[string, RegExp]>
): undefined | (Token.Token & { forword: number }) {
  for (const [label, regexp] of table) {
    const result = execWithIndices(regexp, text)
    if (result !== null) {
      // NOTE The first capture is viewed as the value of the token.
      const value = result[1]
      if (value !== undefined) {
        const main = result[0]
        const forword = main.length
        const [lo, hi] = result.indices[1]
        const span = { lo, hi }
        return { label, value, span, forword }
      }
    }
  }
}
