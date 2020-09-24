import { recognize } from "./recognize"
import * as Mod from "../../../mod"
import * as Env from "../../../env"
import * as Exp from "../../../exp"
import * as Token from "../../../token"
import assert from "assert"

const E = {
  "E:EQF": [["E"], ["Q"], ["F"]],
  "E:F": [["F"]],
}

const F = {
  "F:a": ["a"],
}

const Q = {
  "Q:+": ["+"],
  "Q:-": ["-"],
}

const mod = Mod.build({ E, F, Q })
const env = new Map()

const values = Exp.evaluate(mod, env, Exp.build(E))
const grammar = values[0]

function lex(text: string): Array<Token.Token> {
  const tokens: Array<Token.Token> = new Array()
  for (let i = 0; i < text.length; i++) {
    const span = { lo: i, hi: i + 1 }
    const value = text[i]
    tokens.push({ label: "char", value, span })
  }
  return tokens
}

assert(recognize(lex("a"), grammar))
assert(recognize(lex("a-a"), grammar))
assert(recognize(lex("a-a+a"), grammar, { task: { verbose: true } }))
assert(!recognize(lex("a-a+b"), grammar))
assert(!recognize(lex("a-a++"), grammar))
