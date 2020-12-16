import * as Closure from "./closure"
import * as Telescope from "./telescope"
import * as DelayedSums from "./delayed-sums"
import * as Neutral from "../neutral"
import * as Exp from "../exp"
import * as Mod from "../mod"
import * as Modpath from "../modpath"
import * as Env from "../env"

import { TypeTy } from "../values/type-ty"
import { StrTy } from "../values/str-ty"
import { AbsurdTy } from "../values/absurd-ty"
import { EqualTy } from "../values/equal-ty"
import { QuoteValue } from "../values/quote-value"
import { ClsTy } from "../values/cls-ty"

export type Value =
  | pi
  | fn
  | case_fn
  | ClsTy
  | obj
  | EqualTy
  | same
  | AbsurdTy
  | StrTy
  | QuoteValue
  | union
  | typecons
  | datatype
  | datacons
  | data
  | TypeTy
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
  ret_cl: Array<Closure.Closure>
}

export const case_fn = (ret_cl: Array<Closure.Closure>): case_fn => ({
  kind: "Value.case_fn",
  ret_cl,
})

export type cls = ClsTy
export const cls = ClsTy

export type obj = {
  kind: "Value.obj"
  properties: Map<string, Value>
}

export const obj = (properties: Map<string, Value>): obj => ({
  kind: "Value.obj",
  properties,
})

export type equal = EqualTy
export const equal = EqualTy

export type same = {
  kind: "Value.same"
}

export const same: same = {
  kind: "Value.same",
}

export type absurd = AbsurdTy
export const absurd = AbsurdTy

export type str = StrTy
export const str = StrTy

export type quote = QuoteValue
export const quote = QuoteValue

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

export type typecons = {
  kind: "Value.typecons"
  name: string
  t: Value
  delayed: DelayedSums.DelayedSums
}

export const typecons = (
  name: string,
  t: Value,
  delayed: DelayedSums.DelayedSums
): typecons => ({
  kind: "Value.typecons",
  name,
  t,
  delayed,
})

export type datatype = {
  kind: "Value.datatype"
  typecons: typecons
  args: Array<Value>
  t: Value
}

export const datatype = (
  typecons: typecons,
  args: Array<Value>,
  t: Value
): datatype => ({
  kind: "Value.datatype",
  typecons,
  args,
  t,
})

export type datacons = {
  kind: "Value.datacons"
  typecons: typecons
  tag: string
  t: Value
}

export const datacons = (
  typecons: typecons,
  tag: string,
  t: Value
): datacons => ({
  kind: "Value.datacons",
  typecons,
  tag,
  t,
})

export type data = {
  kind: "Value.data"
  datacons: datacons
  args: Array<Value>
  t: Value
}

export const data = (
  datacons: datacons,
  args: Array<Value>,
  t: Value
): data => ({
  kind: "Value.data",
  datacons,
  args,
  t,
})

export type mod = {
  kind: "Value.mod"
  modpath: Modpath.Modpath
  mod: Mod.Mod
}

export const mod = (modpath: Modpath.Modpath, mod: Mod.Mod): mod => ({
  kind: "Value.mod",
  modpath,
  mod,
})

export type type = TypeTy
export const type = TypeTy

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
