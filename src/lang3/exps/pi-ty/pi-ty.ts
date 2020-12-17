import { Readbackable } from "../../readbackable"
import { Value } from "../../value"
import * as Closure from "../../value/closure"
import { pi_readbackable } from "./pi-readbackable"

export type PiTy = Readbackable & {
  kind: "Value.pi"
  arg_t: Value
  ret_t_cl: Closure.Closure
}

export function PiTy(arg_t: Value, ret_t_cl: Closure.Closure): PiTy {
  return {
    kind: "Value.pi",
    arg_t,
    ret_t_cl,
    ...pi_readbackable(arg_t, ret_t_cl),
  }
}
