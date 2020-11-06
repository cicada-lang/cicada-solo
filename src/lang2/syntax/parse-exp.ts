import * as grammars from "./grammars"
import * as matchers from "./matchers"
import * as Exp from "../exp"
import * as pt from "../../partech"
import * as ut from "../../ut"

export function parse_exp(text: string): Exp.Exp {
  const mod = pt.Mod.from_present(grammars)
  const grammar = pt.Mod.dot(mod, "exp")
  const parser = pt.EarleyParser.create(grammar)
  const lexer = pt.lexers.common
  const tokens = lexer.lex(pt.preprocess.erase_comment(text))
  const tree = parser.parse(tokens)
  const exp = matchers.exp_matcher(tree)
  return exp
}
