import { Var } from "../exps/var"
import { Fn } from "../exps/fn"
import { Ap } from "../exps/ap"
import { Begin } from "../exps/begin"

export type Exp = Var | Fn | Ap | Begin

export type v = Var
export const v = Var

export type fn = Fn
export const fn = Fn

export type ap = Ap
export const ap = Ap

export type begin = Begin
export const begin = Begin
