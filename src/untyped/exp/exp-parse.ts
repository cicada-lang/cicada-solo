import * as Exp from "../exp"
import * as grammars from "../grammars"
import pt from "@forchange/partech"

const lexer = pt.lexers.common.lexer
const parser = pt.parsers.earley.parser

export function parse(text: string): Exp.Exp {
  const tokens = lexer.lex(text)
  const tree = parser.parse(tokens, grammars.exp(), {})
  return grammars.exp_matcher(tree)
}
