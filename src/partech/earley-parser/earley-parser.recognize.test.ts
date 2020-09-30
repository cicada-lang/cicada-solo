import * as EarleyParser from "../earley-parser"
import * as TableLexer from "../table-lexer"
import * as Mod from "../mod"
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

export const mod = Mod.build({ E, F, Q })
export const grammar = Mod.dot(mod, "E")
export const parser = EarleyParser.create(grammar)
export const lexer = TableLexer.create([["char", /(.)/]])

function ok(test: string): void {
  assert(parser.recognize(lexer.lex(test)))
}

function oh(test: string): void {
  assert(!parser.recognize(lexer.lex(test)))
}

ok("a")
ok("a-a")
ok("a-a+a")

oh("a-a+b")
oh("a-a++")
