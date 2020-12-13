import { Evaluable } from "../../evaluable"
import { Inferable } from "../../inferable"
import { Checkable } from "../../checkable"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"
import { absurd_evaluable } from "./absurd-evaluable"
import { absurd_inferable } from "./absurd-inferable"

export type Absurd = Evaluable &
  Inferable &
  Checkable &
  Repr &
  AlphaRepr & {
    kind: "Exp.absurd"
  }

export const Absurd: Absurd = {
  kind: "Exp.absurd",
  ...absurd_evaluable,
  ...absurd_inferable,
  repr: () => "Absurd",
  alpha_repr: (opts) => "Absurd",
}
