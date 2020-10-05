import * as grammars from "./grammars"
import * as matchers from "./matchers"
import * as Stmt from "../stmt"
import * as Exp from "../exp"
import * as pt from "../../partech"
import * as ut from "../../ut"

export function parse_stmts(text: string): Array<Stmt.Stmt> {
  const mod = pt.Mod.build(grammars)
  const grammar = pt.Mod.dot(mod, "stmts")
  const parser = pt.EarleyParser.create(grammar)
  const lexer = pt.lexers.common
  const tokens = lexer.lex(pt.preprocess.erase_comment(text))
  const tree = parser.parse(tokens)
  const stmts = matchers.stmts_matcher(tree)
  return stmts
}
