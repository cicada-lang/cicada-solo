import { Ty } from "../ty"
import { Value } from "../value"
import * as Closure from "../value/closure"
import { pi_readback_as_type } from "./pi-readback-as-type"

export type PiTy = Ty & {
  kind: "Value.pi"
  arg_t: Value
  ret_t_cl: Closure.Closure
}

export function PiTy(arg_t: Value, ret_t_cl: Closure.Closure): PiTy {
  return {
    kind: "Value.pi",
    arg_t,
    ret_t_cl,
    typed_readback: (value, { mod, ctx }) => {
      throw new Error("TODO")
    },
    readback_as_type: pi_readback_as_type(arg_t, ret_t_cl),
  }
}
