import * as TableLexer from "../table-lexer"
import * as Token from "../token"

const table_lexer = TableLexer.build([
  ["identifier", "^\\s*([_\\p{Letter}][_\\p{Letter}0-9]*)\\s*", "u"],
  ["string", '^\\s*("(\\\\.|[^"])*")\\s*'],
  ["number", "^\\s*(\\d+\\.\\d+|\\d+|-\\d+\\.\\d+|-\\d+)\\s*"],
  ["symbol", "^\\s*([^_\\p{Letter}0-9\\s])\\s*", "u"],
])

export const common = {
  lex(text: string): Array<Token.Token> {
    return text.trim().length === 0 ? [] : table_lexer.lex(text)
  },
}
