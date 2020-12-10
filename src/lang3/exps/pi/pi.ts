import { Evaluable } from "../../evaluable"
import { Exp } from "../../exp"
import { Repr } from "../../repr"
import { pi_evaluable } from "./pi-evaluable"

export type Pi = Evaluable &
  Repr & {
    kind: "Exp.pi"
    name: string
    arg_t: Exp
    ret_t: Exp
  }

export function Pi(name: string, arg_t: Exp, ret_t: Exp): Pi {
  return {
    kind: "Exp.pi",
    name,
    arg_t,
    ret_t,
    ...pi_evaluable(name, arg_t, ret_t),
    repr: () => `(${name}: ${arg_t.repr()}) -> ${ret_t.repr()}`,
  }
}
