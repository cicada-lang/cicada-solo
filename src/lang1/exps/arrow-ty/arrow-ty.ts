import { Ty } from "../../ty"
import { EtaExpander } from "../../eta-expander"
import { Repr } from "../../repr"
import { arrow_eta_expander } from "./arrow-eta-expander"

export type ArrowTy = EtaExpander &
  Repr & {
    kind: "ArrowTy"
    arg_t: Ty
    ret_t: Ty
  }

export function ArrowTy(arg_t: Ty, ret_t: Ty): ArrowTy {
  return {
    kind: "ArrowTy",
    arg_t,
    ret_t,
    ...arrow_eta_expander(arg_t, ret_t),
    repr: () => `(${arg_t.repr()}) -> ${ret_t.repr()}`,
  }
}
