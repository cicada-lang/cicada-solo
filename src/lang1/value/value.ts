import * as Ty from "../ty"
import * as Exp from "../exp"
import * as Env from "../env"
import * as Neutral from "../neutral"

import { FnValue } from "../exps/fn-value"
import { ZeroValue } from "../exps/zero-value"
import { Add1Value } from "../exps/add1-value"
import { NotYetValue } from "../exps/not-yet-value"

export type Value = NotYetValue | FnValue | ZeroValue | Add1Value

export type not_yet = NotYetValue
export const not_yet = NotYetValue

export type fn = FnValue
export const fn = FnValue

export type zero = ZeroValue
export const zero = ZeroValue

export type add1 = Add1Value
export const add1 = Add1Value
