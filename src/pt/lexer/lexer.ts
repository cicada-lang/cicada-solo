import * as Token from "../token"

export interface Lexer {
  lex(text: string): Array<Token.Token>
}
