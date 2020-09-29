import * as Value from "../value"
import * as Tree from "../tree"
import * as Lexer from "../lexer"

export interface Lang<R> {
  lexer: Lexer.Lexer
  grammar: Value.grammar

  description?: string
  matcher?: (tree: Tree.Tree) => R
  preprocesser?: (text: string) => string

  example?: {
    right?: Array<string>
    wrong?: Array<string>
  }

  example_file?: {
    right?: Array<string>
    wrong?: Array<string>
  }
}
