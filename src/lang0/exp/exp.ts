import { Var } from "../exps/var"
import { Fn } from "../exps/fn"
import { Ap } from "../exps/ap"

export type Exp = Var | Fn | Ap | begin

import * as Stmt from "../stmt"

export type v = Var
export const v = Var

export type fn = Fn
export const fn = Fn

export type ap = Ap
export const ap = Ap

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
