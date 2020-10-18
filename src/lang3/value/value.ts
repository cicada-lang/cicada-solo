import * as Closure from "./closure"
import * as Telescope from "./telescope"
import * as DelayedSums from "./delayed-sums"
import * as Neutral from "../neutral"
import * as Exp from "../exp"
import * as Mod from "../mod"
import * as Env from "../env"

export type Value =
  | pi
  | fn
  | case_fn
  | cls
  | obj
  | equal
  | same
  | absurd
  | str
  | quote
  | union
  | type_constructor
  | datatype
  | data_constructor
  | data
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

export interface fn {
  kind: "Value.fn"
  ret_cl: Closure.Closure
}

export const fn = (ret_cl: Closure.Closure): fn => ({
  kind: "Value.fn",
  ret_cl,
})

export interface case_fn {
  kind: "Value.case_fn"
  ret_cls: Array<Closure.Closure>
}

export const case_fn = (ret_cls: Array<Closure.Closure>): case_fn => ({
  kind: "Value.case_fn",
  ret_cls,
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

export interface obj {
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

export interface same {
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

export interface quote {
  kind: "Value.quote"
  str: string
}

export const quote = (str: string): quote => ({
  kind: "Value.quote",
  str,
})

export interface union {
  kind: "Value.union"
  left: Value
  right: Value
}

export const union = (left: Value, right: Value): union => ({
  kind: "Value.union",
  left,
  right,
})

export interface type_constructor {
  kind: "Value.type_constructor"
  name: string
  t: Value
  delayed: DelayedSums.DelayedSums
}

export const type_constructor = (
  name: string,
  t: Value,
  delayed: DelayedSums.DelayedSums
): type_constructor => ({
  kind: "Value.type_constructor",
  name,
  t,
  delayed,
})

export interface datatype {
  kind: "Value.datatype"
  type_constructor: type_constructor
  args: Array<Value>
  t: Value
}

export const datatype = (
  type_constructor: type_constructor,
  args: Array<Value>,
  t: Value
): datatype => ({
  kind: "Value.datatype",
  type_constructor,
  args,
  t,
})

export interface data_constructor {
  kind: "Value.data_constructor"
  type_constructor: type_constructor
  tag: string
  t: Value
}

export const data_constructor = (
  type_constructor: type_constructor,
  tag: string,
  t: Value
): data_constructor => ({
  kind: "Value.data_constructor",
  type_constructor,
  tag,
  t,
})

export interface data {
  kind: "Value.data"
  data_constructor: data_constructor
  args: Array<Value>
  t: Value
}

export const data = (
  data_constructor: data_constructor,
  args: Array<Value>,
  t: Value
): data => ({
  kind: "Value.data",
  data_constructor,
  args,
  t,
})

export interface type {
  kind: "Value.type"
}

export const type: type = {
  kind: "Value.type",
}

export interface not_yet {
  kind: "Value.not_yet"
  t: Value
  neutral: Neutral.Neutral
}

export const not_yet = (t: Value, neutral: Neutral.Neutral): not_yet => ({
  kind: "Value.not_yet",
  t,
  neutral,
})
