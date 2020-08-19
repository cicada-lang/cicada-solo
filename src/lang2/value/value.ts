import * as Ty from "../ty"
import * as Neutral from "../neutral"
import * as Closure from "../closure"

export type Value =
  | pi
  | fn
  | sigma
  | cons
  | nat
  | zero
  | add1
  | equal
  | same
  | trivial
  | sole
  | absurd
  | str
  | quote
  | type
  | reflection

export interface pi {
  kind: "Value.pi"
  arg_t: Value
  closure: Closure.Closure
}

export const pi = (arg_t: Value, closure: Closure.Closure): pi => ({
  kind: "Value.pi",
  arg_t,
  closure,
})

interface fn {
  kind: "Value.fn"
  closure: Closure.Closure
}

export const fn = (closure: Closure.Closure): fn => ({
  kind: "Value.fn",
  closure,
})

export interface sigma {
  kind: "Value.sigma"
  car_t: Value
  closure: Closure.Closure
}

export const sigma = (car_t: Value, closure: Closure.Closure): sigma => ({
  kind: "Value.sigma",
  car_t,
  closure,
})

interface cons {
  kind: "Value.cons"
  car: Value
  cdr: Value
}

export const cons = (car: Value, cdr: Value): cons => ({
  kind: "Value.cons",
  car,
  cdr,
})

export interface nat {
  kind: "Value.nat"
}

export const nat: nat = {
  kind: "Value.nat",
}

interface zero {
  kind: "Value.zero"
}

export const zero: zero = {
  kind: "Value.zero",
}

interface add1 {
  kind: "Value.add1"
  prev: Value
}

export const add1 = (prev: Value): add1 => ({
  kind: "Value.add1",
  prev,
})

export interface equal {
  kind: "Value.equal"
  t: Ty.Ty
  from: Value
  to: Value
}

export const equal = (t: Ty.Ty, from: Value, to: Value): equal => ({
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

export interface trivial {
  kind: "Value.trivial"
}

export const trivial: trivial = {
  kind: "Value.trivial",
}

interface sole {
  kind: "Value.sole"
}

export const sole: sole = {
  kind: "Value.sole",
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

interface reflection {
  kind: "Value.reflection"
  t: Ty.Ty
  neutral: Neutral.Neutral
}

export const reflection = (t: Ty.Ty, neutral: Neutral.Neutral): reflection => ({
  kind: "Value.reflection",
  t,
  neutral,
})
