import * as EarleyParser from "../earley-parser"
import * as TableLexer from "../table-lexer"
import * as Mod from "../mod"
import * as Env from "../env"
import * as Exp from "../exp"
import * as Token from "../token"
import * as Tree from "../tree"
import * as ut from "../../ut"
import assert from "assert"
import { parser, lexer } from "./earley-parser.parse.test"

function show(text: string): void {
  const tree = parser.parse(lexer.lex(text))
  console.log(JSON.stringify(tree, null, 2))
}

show("(a)")
show("(a)(a)")
show("(a)(a)(a)")
show("(a-a)")
show("(a-a+a)")
show("(a)(a)(a)(a)(a)(a)(a)(a)")
show("(a-a)(a-a)(a-a)")
show("(a-a+a)(a-a+a)(a-a+a)")
show("(a)(a-a)(a-a+a)")
