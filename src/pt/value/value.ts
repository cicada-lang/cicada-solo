import * as Closure from "./closure"
import * as GrammarThunk from "./grammar-thunk"

export type Value = fn | str | pattern | grammar

interface fn {
  kind: "Value.fn"
  ret_cl: Closure.Closure
}

export const fn = (ret_cl: Closure.Closure): fn => ({
  kind: "Value.fn",
  ret_cl,
})

interface str {
  kind: "Value.str"
  value: string
}

export const str = (value: string): str => ({
  kind: "Value.str",
  value,
})

interface pattern {
  kind: "Value.pattern"
  label: string
  value: RegExp
}

export const pattern = (label: string, value: RegExp): pattern => ({
  kind: "Value.pattern",
  label,
  value,
})

interface grammar {
  kind: "Value.grammar"
  grammar_thunk: GrammarThunk.GrammarThunk
}

export const grammar = (grammar_thunk: GrammarThunk.GrammarThunk): grammar => ({
  kind: "Value.grammar",
  grammar_thunk,
})
