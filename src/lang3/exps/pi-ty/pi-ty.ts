import { ReadbackAsType } from "../../readback-as-type"
import { Value } from "../../value"
import * as Closure from "../../value/closure"
import { pi_readback_as_type } from "./pi-readback-as-type"

export type PiTy = ReadbackAsType & {
  kind: "Value.pi"
  arg_t: Value
  ret_t_cl: Closure.Closure
}

export function PiTy(arg_t: Value, ret_t_cl: Closure.Closure): PiTy {
  return {
    kind: "Value.pi",
    arg_t,
    ret_t_cl,
    ...pi_readback_as_type(arg_t, ret_t_cl),
  }
}
