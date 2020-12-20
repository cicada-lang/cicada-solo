export * from "./value"

import { FnValue } from "../exps/fn-value"
import { ZeroValue } from "../exps/zero-value"
import { Add1Value } from "../exps/add1-value"
import { NotYetValue } from "../exps/not-yet-value"

export type not_yet = NotYetValue
export const not_yet = NotYetValue

export type fn = FnValue
export const fn = FnValue

export type zero = ZeroValue
export const zero = ZeroValue

export type add1 = Add1Value
export const add1 = Add1Value
