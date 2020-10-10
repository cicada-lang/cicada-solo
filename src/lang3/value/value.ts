import * as Neutral from "../neutral"
import * as Closure from "../closure"
import * as Telescope from "../telescope"

export type Value =
  | pi
  | fn
  | cls
  | obj
  | equal
  | same
  | absurd
  | str
  | quote
  | type
  | not_yet

export interface pi {
  kind: "Value.pi"
  arg_t: Value
  ret_t_cl: Closure.Closure
}

export const pi = (arg_t: Value, ret_t_cl: Closure.Closure): pi => ({
  kind: "Value.pi",
  arg_t,
  ret_t_cl,
})

interface fn {
  kind: "Value.fn"
  ret_cl: Closure.Closure
}

export const fn = (ret_cl: Closure.Closure): fn => ({
  kind: "Value.fn",
  ret_cl,
})

export interface cls {
  kind: "Value.cls"
  sat: Array<{ name: string; t: Value; value: Value }>
  tel: Telescope.Telescope
}

export const cls = (
  sat: Array<{ name: string; t: Value; value: Value }>,
  tel: Telescope.Telescope
): cls => ({
  kind: "Value.cls",
  sat,
  tel,
})

interface obj {
  kind: "Value.obj"
  properties: Map<string, Value>
}

export const obj = (properties: Map<string, Value>): obj => ({
  kind: "Value.obj",
  properties,
})

export interface equal {
  kind: "Value.equal"
  t: Value
  from: Value
  to: Value
}

export const equal = (t: Value, from: Value, to: Value): equal => ({
  kind: "Value.equal",
  t,
  from,
  to,
})

interface same {
  kind: "Value.same"
}

export const same: same = {
  kind: "Value.same",
}

export interface absurd {
  kind: "Value.absurd"
}

export const absurd: absurd = {
  kind: "Value.absurd",
}

export interface str {
  kind: "Value.str"
}

export const str: str = {
  kind: "Value.str",
}

interface quote {
  kind: "Value.quote"
  str: string
}

export const quote = (str: string): quote => ({
  kind: "Value.quote",
  str,
})

export interface type {
  kind: "Value.type"
}

export const type: type = {
  kind: "Value.type",
}

interface not_yet {
  kind: "Value.not_yet"
  t: Value
  neutral: Neutral.Neutral
}

export const not_yet = (t: Value, neutral: Neutral.Neutral): not_yet => ({
  kind: "Value.not_yet",
  t,
  neutral,
})
