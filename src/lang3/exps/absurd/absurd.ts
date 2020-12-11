import { Evaluable } from "../../evaluable"
import { Inferable } from "../../inferable"
import { Repr } from "../../repr"
import { absurd_evaluable } from "./absurd-evaluable"
import { absurd_inferable } from "./absurd-inferable"

export type Absurd = Evaluable &
  Inferable &
  Repr & {
    kind: "Exp.absurd"
  }

export const Absurd: Absurd = {
  kind: "Exp.absurd",
  ...absurd_evaluable,
  ...absurd_inferable,
  repr: () => "Absurd",
}
