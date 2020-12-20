import { Exp } from "../../exp"
import { Ty } from "../../ty"
import { the_evaluable } from "./the-evaluable"
import { the_inferable } from "./the-inferable"

export type The = Exp & {
  kind: "The"
  t: Ty
  exp: Exp
}

export function The(t: Ty, exp: Exp): The {
  return {
    kind: "The",
    t,
    exp,
    ...the_evaluable(t, exp),
    ...the_inferable(t, exp),
    repr: () => `{ ${t.repr()} -- ${exp.repr()} }`,
  }
}
