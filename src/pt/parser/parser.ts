import * as Token from "../token"
import * as Tree from "../tree"
import * as Value from "../value"

export interface Parser {
  parse(tokens: Array<Token.Token>): Tree.Tree
  grammar: Value.grammar
}
