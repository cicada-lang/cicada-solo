import { Evaluable } from "../../evaluable"
import { Exp } from "../../exp"
import { Repr } from "../../repr"
import { typecons_evaluable } from "./typecons-evaluable"

export type Typecons = Evaluable &
  Repr & {
    kind: "Exp.typecons"
    name: string
    t: Exp
    sums: Array<{ tag: string; t: Exp }>
  }

export function Typecons(
  name: string,
  t: Exp,
  sums: Array<{ tag: string; t: Exp }>
): Typecons {
  return {
    kind: "Exp.typecons",
    name,
    t,
    sums,
    ...typecons_evaluable(name, t, sums),
    repr: () => name,
  }
}
