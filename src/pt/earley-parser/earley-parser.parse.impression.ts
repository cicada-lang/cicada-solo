import * as EarleyParser from "../earley-parser"
import * as TableLexer from "../table-lexer"
import * as Mod from "../mod"
import * as Env from "../env"
import * as Exp from "../exp"
import * as Token from "../token"
import * as ut from "../../ut"
import assert from "assert"

const E = {
  "E:EQF": ["E", "Q", "F"],
  "E:F": ["F"],
}

const F = {
  "F:a": ['"a"'],
}

const Q = {
  "Q:+": ['"+"'],
  "Q:-": ['"-"'],
}

const one_or_more = {
  $fn: [
    "x",
    {
      "one_or_more:one": [{ value: "x" }],
      "one_or_more:more": [
        { head: "x" },
        { tail: { $ap: ["one_or_more", "x"] } },
      ],
    },
  ],
}

const S = {
  "S:S": [{ start: { $ap: ["one_or_more", '"("', "E", '")"'] } }],
}

const mod = Mod.build({ E, F, Q, one_or_more, S })
export const grammar = Mod.dot(mod, "S")
export const parser = EarleyParser.create(grammar)
export const lexer = TableLexer.create([["char", /(.)/]])

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
