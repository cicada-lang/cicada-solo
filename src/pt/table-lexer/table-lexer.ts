import * as Lexer from "../lexer"

export interface TableLexer extends Lexer.Lexer {
  table: Array<{
    label: string
    value: RegExp
  }>
}
