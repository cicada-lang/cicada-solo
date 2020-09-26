import { parse } from "./parse"
import * as Mod from "../../mod"
import * as Env from "../../env"
import * as Exp from "../../exp"
import * as Token from "../../token"
import * as ut from "../../../ut"
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
const env = new Map()

const values = Exp.evaluate(mod, env, Exp.build(S))
export const grammar = values[0]

export function lex(text: string): Array<Token.Token> {
  const tokens: Array<Token.Token> = new Array()
  for (let i = 0; i < text.length; i++) {
    const span = { lo: i, hi: i + 1 }
    const value = text[i]
    tokens.push({ label: "char", value, span })
  }
  return tokens
}

function impression(text: string): void {
  const tree = parse(lex(text), grammar)
  console.log(JSON.stringify(tree, null, 2))
}

impression("(a)")
impression("(a)(a)")
impression("(a)(a)(a)")
impression("(a-a)")
impression("(a-a+a)")
impression("(a)(a)(a)(a)(a)(a)(a)(a)")
impression("(a-a)(a-a)(a-a)")
impression("(a-a+a)(a-a+a)(a-a+a)")
impression("(a)(a-a)(a-a+a)")
