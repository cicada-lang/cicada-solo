import * as Closure from "./closure"
import * as DelayedChoices from "./delayed-choices"

export type Value = fn | str | pattern | grammar

type fn = {
  kind: "Value.fn"
  ret_cl: Closure.Closure
}

export const fn = (ret_cl: Closure.Closure): fn => ({
  kind: "Value.fn",
  ret_cl,
})

type str = {
  kind: "Value.str"
  value: string
}

export const str = (value: string): str => ({
  kind: "Value.str",
  value,
})

type pattern = {
  kind: "Value.pattern"
  label: string
  value: RegExp
}

export const pattern = (label: string, value: RegExp): pattern => ({
  kind: "Value.pattern",
  label,
  value,
})

export type grammar = {
  kind: "Value.grammar"
  name: string
  delayed: DelayedChoices.DelayedChoices
}

export const grammar = (
  name: string,
  delayed: DelayedChoices.DelayedChoices
): grammar => ({
  kind: "Value.grammar",
  name,
  delayed,
})
