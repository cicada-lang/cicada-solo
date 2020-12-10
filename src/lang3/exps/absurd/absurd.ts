import { Evaluable } from "../../evaluable"
import { Repr } from "../../repr"
import { absurd_evaluable } from "./absurd-evaluable"

export type Absurd = Evaluable &
  Repr & {
    kind: "Exp.absurd"
  }

export const Absurd: Absurd = {
  kind: "Exp.absurd",
  ...absurd_evaluable,
  repr: () => "Absurd",
}
