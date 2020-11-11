import * as Token from "../token"

export type Lexer = {
  lex(text: string): Array<Token.Token>
}
