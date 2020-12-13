import * as Exp from "../exp"
import { alpha_repr } from "./exp-alpha-repr"

export function equivalent(x: Exp.Exp, y: Exp.Exp): boolean {
  const ctx = { depth: 0, depths: new Map() }
  return alpha_repr(x, ctx) === alpha_repr(y, ctx)
}
