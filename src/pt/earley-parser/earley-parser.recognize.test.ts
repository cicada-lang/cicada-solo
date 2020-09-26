import * as EarleyParser from "../earley-parser"
import * as TableLexer from "../table-lexer"
import * as Mod from "../mod"
import * as Exp from "../exp"
import * as Token from "../token"
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

const mod = Mod.build({ E, F, Q })
const env = new Map()

const values = Exp.evaluate(mod, env, Exp.build(E))
export const grammar = values[0]

const parser = EarleyParser.create(grammar)

export const lexer = TableLexer.create([["char", /(.)/]])

function ok(test: string): void {
  assert(parser.recognize(lexer.lex(test)))
}

function no(test: string): void {
  assert(!parser.recognize(lexer.lex(test)))
}

ok("a")
ok("a-a")
ok("a-a+a")

no("a-a+b")
no("a-a++")
