import * as Lexer from "../lexer"

export type TableLexer = Lexer.Lexer & {
  table: Array<[string, RegExp]>
}
