import * as Closure from "./closure"
import * as Telescope from "./telescope"
import * as DelayedSums from "./delayed-sums"
import * as Neutral from "../neutral"
import * as Exp from "../exp"
import * as Mod from "../mod"
import * as Env from "../env"
import * as Modpath from "../modpath"

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
  | mod
  | not_yet

export type pi = {
  kind: "Value.pi"
  arg_t: Value
  ret_t_cl: Closure.Closure
}

export const pi = (arg_t: Value, ret_t_cl: Closure.Closure): pi => ({
  kind: "Value.pi",
  arg_t,
  ret_t_cl,
})

export type fn = {
  kind: "Value.fn"
  ret_cl: Closure.Closure
}

export const fn = (ret_cl: Closure.Closure): fn => ({
  kind: "Value.fn",
  ret_cl,
})

export type case_fn = {
  kind: "Value.case_fn"
  ret_cls: Array<Closure.Closure>
}

export const case_fn = (ret_cls: Array<Closure.Closure>): case_fn => ({
  kind: "Value.case_fn",
  ret_cls,
})

export type cls = {
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

export type obj = {
  kind: "Value.obj"
  properties: Map<string, Value>
}

export const obj = (properties: Map<string, Value>): obj => ({
  kind: "Value.obj",
  properties,
})

export type equal = {
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

export type same = {
  kind: "Value.same"
}

export const same: same = {
  kind: "Value.same",
}

export type absurd = {
  kind: "Value.absurd"
}

export const absurd: absurd = {
  kind: "Value.absurd",
}

export type str = {
  kind: "Value.str"
}

export const str: str = {
  kind: "Value.str",
}

export type quote = {
  kind: "Value.quote"
  str: string
}

export const quote = (str: string): quote => ({
  kind: "Value.quote",
  str,
})

export type union = {
  kind: "Value.union"
  left: Value
  right: Value
}

export const union = (left: Value, right: Value): union => ({
  kind: "Value.union",
  left,
  right,
})

export type type_constructor = {
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

export type datatype = {
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

export type data_constructor = {
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

export type data = {
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

export type mod = {
  kind: "Value.mod"
  modpath: Modpath.Modpath
}

export const mod = (modpath: Modpath.Modpath): mod => ({
  kind: "Value.mod",
  modpath,
})

export type type = {
  kind: "Value.type"
}

export const type: type = {
  kind: "Value.type",
}

export type not_yet = {
  kind: "Value.not_yet"
  t: Value
  neutral: Neutral.Neutral
}

export const not_yet = (t: Value, neutral: Neutral.Neutral): not_yet => ({
  kind: "Value.not_yet",
  t,
  neutral,
})
