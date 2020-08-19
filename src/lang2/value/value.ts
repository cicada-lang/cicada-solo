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

export interface fn {
  kind: "Value.fn"
  closure: Closure.Closure
}

export interface sigma {
  kind: "Value.sigma"
  car_t: Value
  closure: Closure.Closure
}

export interface cons {
  kind: "Value.cons"
  car: Value
  cdr: Value
}

export interface nat {
  kind: "Value.nat"
}

export interface zero {
  kind: "Value.zero"
}

export interface add1 {
  kind: "Value.add1"
  prev: Value
}

export interface equal {
  kind: "Value.equal"
  t: Ty.Ty
  from: Value
  to: Value
}

export interface same {
  kind: "Value.same"
}

export interface trivial {
  kind: "Value.trivial"
}

export interface sole {
  kind: "Value.sole"
}

export interface absurd {
  kind: "Value.absurd"
}

export interface str {
  kind: "Value.str"
}

export interface quote {
  kind: "Value.quote"
  str: string
}

export interface type {
  kind: "Value.type"
}

export interface reflection {
  kind: "Value.reflection"
  t: Ty.Ty
  neutral: Neutral.Neutral
}
