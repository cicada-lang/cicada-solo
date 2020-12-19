import * as Stmt from "../stmt"
import * as Ty from "../ty"

import { Var } from "../exps/var"
import { Fn } from "../exps/fn"

export type Exp = Var | Fn | ap | zero | add1 | rec | begin | the

export type v = Var
export const v = Var

export type fn = Fn
export const fn = Fn

export type ap = {
  kind: "Exp.ap"
  target: Exp
  arg: Exp
}

export const ap = (target: Exp, arg: Exp): ap => ({
  kind: "Exp.ap",
  target,
  arg,
})

export type begin = {
  kind: "Exp.begin"
  stmts: Array<Stmt.Stmt>
  ret: Exp
}

export const begin = (stmts: Array<Stmt.Stmt>, ret: Exp): begin => ({
  kind: "Exp.begin",
  stmts,
  ret,
})

export type zero = {
  kind: "Exp.zero"
}

export const zero: zero = { kind: "Exp.zero" }

export type add1 = {
  kind: "Exp.add1"
  prev: Exp
}

export const add1 = (prev: Exp): add1 => ({ kind: "Exp.add1", prev })

export type rec = {
  kind: "Exp.rec"
  t: Ty.Ty
  target: Exp
  base: Exp
  step: Exp
}

export const rec = (t: Ty.Ty, target: Exp, base: Exp, step: Exp): rec => ({
  kind: "Exp.rec",
  t,
  target,
  base,
  step,
})

export type the = {
  kind: "Exp.the"
  t: Ty.Ty
  exp: Exp
}

export const the = (t: Ty.Ty, exp: Exp): the => ({ kind: "Exp.the", t, exp })
