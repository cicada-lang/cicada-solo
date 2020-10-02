import * as Exp from "../exp"
import * as pt from "../../partech"
import * as ut from "../../ut"

export function parse(text: string): Exp.Exp {
  const mod = pt.Mod.build(Exp.grammars)
  const grammar = pt.Mod.dot(mod, "exp")
  const parser = pt.EarleyParser.create(grammar)
  const lexer = pt.lexers.common
  const tokens = lexer.lex(text)
  const tree = parser.parse(tokens)
  const exp = Exp.from_tree(tree)
  return exp
}
