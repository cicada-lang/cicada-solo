import { FnValue } from "../exps/fn-value"
import { NotYetValue } from "../exps/not-yet-value"

export type Value = FnValue | NotYetValue

export type fn = FnValue
export const fn = FnValue

export type not_yet = NotYetValue
export const not_yet = NotYetValue
