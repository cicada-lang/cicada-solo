import * as grammars from "./grammars"
import * as matchers from "./matchers"
import * as Stmt from "../stmt"
import * as pt from "../../partech"

export const parse_stmts = pt.gen_parse({
  grammars,
  start: "stmts",
  lexer: pt.lexers.common,
  matcher: matchers.stmts_matcher,
  preprocess: pt.preprocess.erase_comment,
})
