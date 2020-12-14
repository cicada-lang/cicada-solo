import { Exp } from "../../exp"
import { absurd_evaluable } from "./absurd-evaluable"
import { absurd_inferable } from "./absurd-inferable"

export type Absurd = Exp & {
  kind: "Exp.absurd"
}

export const Absurd: Absurd = {
  kind: "Exp.absurd",
  ...absurd_evaluable,
  ...absurd_inferable,
  repr: () => "Absurd",
  alpha_repr: (opts) => "Absurd",
}
