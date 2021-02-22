import * as Lexer from "../lexer"
import * as Value from "../value"
import * as Tree from "../tree"
import * as EarleyParser from "../earley-parser"

export function gen_parse<A>(the: {
  preprocess?: (text: string) => string
  lexer: Lexer.Lexer
  grammar: Value.grammar
  matcher: (tree: Tree.Tree) => A
}): (text: string) => A {
  const parser = EarleyParser.create(the.grammar)
  return (text) => {
    if (the.preprocess) {
      text = the.preprocess(text)
    }
    return the.matcher(parser.parse(the.lexer.lex(text)))
  }
}
