import * as Ty from "../ty"
import * as Neutral from "../neutral"
import * as Closure from "../closure"

export type Value =
  | Pi
  | Fn
  | Sigma
  | Cons
  | Nat
  | Zero
  | Succ
  | Equal
  | Same
  | Trivial
  | Sole
  | Absurd
  | Str
  | Quote
  | Type
  | Reflection

export interface Pi {
  kind: "Value.Pi"
  arg_t: Value
  closure: Closure.Closure
}

export interface Fn {
  kind: "Value.Fn"
  closure: Closure.Closure
}

export interface Sigma {
  kind: "Value.Sigma"
  car_t: Value
  closure: Closure.Closure
}

export interface Cons {
  kind: "Value.Cons"
  car: Value
  cdr: Value
}

export interface Nat {
  kind: "Value.Nat"
}

export interface Zero {
  kind: "Value.Zero"
}

export interface Succ {
  kind: "Value.Succ"
  prev: Value
}

export interface Equal {
  kind: "Value.Equal"
  t: Ty.Ty
  from: Value
  to: Value
}

export interface Same {
  kind: "Value.Same"
}

export interface Trivial {
  kind: "Value.Trivial"
}

export interface Sole {
  kind: "Value.Sole"
}

export interface Absurd {
  kind: "Value.Absurd"
}

export interface Str {
  kind: "Value.Str"
}

export interface Quote {
  kind: "Value.Quote"
  str: string
}

export interface Type {
  kind: "Value.Type"
}

export interface Reflection {
  kind: "Value.Reflection"
  t: Ty.Ty
  neutral: Neutral.Neutral
}
