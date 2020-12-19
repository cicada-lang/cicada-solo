import * as Stmt from "../stmt"
import * as Ty from "../ty"

import { Var } from "../exps/var"
import { Fn } from "../exps/fn"
import { Ap } from "../exps/ap"
import { Zero } from "../exps/zero"
import { Add1 } from "../exps/add1"
import { Rec } from "../exps/rec"
import { Begin } from "../exps/begin"

export type Exp = Var | Fn | Ap | Zero | Add1 | Rec | Begin | the

export type v = Var
export const v = Var

export type fn = Fn
export const fn = Fn

export type ap = Ap
export const ap = Ap

export type zero = Zero
export const zero = Zero

export type add1 = Add1
export const add1 = Add1

export type rec = Rec
export const rec = Rec

export type begin = Begin
export const begin = Begin

export type the = {
  kind: "Exp.the"
  t: Ty.Ty
  exp: Exp
}

export const the = (t: Ty.Ty, exp: Exp): the => ({ kind: "Exp.the", t, exp })
