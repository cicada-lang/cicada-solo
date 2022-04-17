import pt from "@cicada-lang/partech"
import * as grammars from "./grammars"
import * as matchers from "./matchers"

export class Parser {
  parseExp = pt.gen_parse({
    preprocess: pt.preprocess.erase_comment,
    lexer: pt.lexers.common,
    grammar: pt.grammar_start(grammars, "exp"),
    matcher: matchers.exp_matcher,
  })

  parseExps = pt.gen_parse({
    preprocess: pt.preprocess.erase_comment,
    lexer: pt.lexers.common,
    grammar: pt.grammar_start(grammars, "exps"),
    matcher: matchers.exps_matcher,
  })

  parseStmts = pt.gen_parse({
    preprocess: pt.preprocess.erase_comment,
    lexer: pt.lexers.common,
    grammar: pt.grammar_start(grammars, "stmts"),
    matcher: matchers.stmts_matcher,
  })
}
