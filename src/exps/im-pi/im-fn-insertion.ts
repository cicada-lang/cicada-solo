import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import * as Exps from "../../exps"

export interface ImFnInsertion {
  insert_im_fn(ctx: Ctx, fn: Exps.Fn): Core
}

export const ImFnInsertion = {
  // NOTE A type guard for type-based implicit function insertion.
  based_on(value: Value): value is Value & ImFnInsertion {
    return (value as any)["insert_im_fn"] instanceof Function
  },
}
