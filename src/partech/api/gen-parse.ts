import * as pt from "../"

export function gen_parse<A>(the: {
  preprocess?: (text: string) => string
  lexer: pt.Lexer.Lexer
  grammar: pt.Value.grammar
  matcher: (tree: pt.Tree.Tree) => A
}): (text: string) => A {
  const parser = pt.EarleyParser.create(the.grammar)
  return (text) => {
    if (the.preprocess) {
      text = the.preprocess(text)
    }
    return the.matcher(parser.parse(the.lexer.lex(text)))
  }
}
