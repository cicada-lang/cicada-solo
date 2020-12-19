import { Ty } from "../../ty"

export type Arrow = {
  kind: "Ty.arrow"
  arg_t: Ty
  ret_t: Ty
}

export function Arrow(arg_t: Ty, ret_t: Ty): Arrow {
  return {
    kind: "Ty.arrow",
    arg_t,
    ret_t,
  }
}
