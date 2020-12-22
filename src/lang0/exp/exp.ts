import { Var } from "../exps/var"
import { Fn } from "../exps/fn"

export type Exp = Var | Fn | ap | begin

import * as Stmt from "../stmt"

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
