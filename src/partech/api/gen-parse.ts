import * as pt from "../"

export function gen_parse<A>(the: {
  grammars: pt.Mod.Present
  start: string
  lexer: pt.Lexer.Lexer
  matcher: (tree: pt.Tree.Tree) => A
  preprocess?: (text: string) => string
}): (text: string) => A {
  const mod = pt.Mod.from_present(the.grammars)
  const parser = pt.EarleyParser.create(pt.Mod.dot(mod, the.start))
  return (text) => {
    if (the.preprocess) {
      text = the.preprocess(text)
    }
    return the.matcher(parser.parse(the.lexer.lex(text)))
  }
}
