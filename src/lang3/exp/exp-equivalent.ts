import * as Exp from "../exp"
import { alpha_print } from "./exp-alpha-print"

export function equivalent(x: Exp.Exp, y: Exp.Exp): boolean {
  const ctx = { depth: 0, depths: new Map() }
  return alpha_print(x, ctx) === alpha_print(y, ctx)
}
