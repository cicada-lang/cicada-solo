import { Evaluable } from "../../evaluable"
import { Inferable } from "../../inferable"
import { Checkable } from "../../checkable"
import { Exp } from "../../exp"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"
import * as ut from "../../../ut"
import { cls_evaluable } from "./cls-evaluable"
import { cls_inferable } from "./cls-inferable"

export type Cls = Evaluable &
  Checkable &
  Inferable &
  Repr &
  AlphaRepr & {
    kind: "Exp.cls"
    sat: Array<{ name: string; t: Exp; exp: Exp }>
    scope: Array<{ name: string; t: Exp }>
  }

export function Cls(
  sat: Array<{ name: string; t: Exp; exp: Exp }>,
  scope: Array<{ name: string; t: Exp }>
): Cls {
  return {
    kind: "Exp.cls",
    sat,
    scope,
    ...cls_evaluable(sat, scope),
    ...cls_inferable(sat, scope),
    ...cls_repr(sat, scope),
    ...cls_alpha_repr(sat, scope),
  }
}

const cls_repr = (
  sat: Array<{ name: string; t: Exp; exp: Exp }>,
  scope: Array<{ name: string; t: Exp }>
) => ({
  repr: () => {
    if (sat.length === 0 && scope.length === 0) return "Object"
    const parts = [
      ...sat.map(({ name, t, exp }) => `${name} : ${t.repr()} = ${exp.repr()}`),
      ...scope.map(({ name, t }) => `${name} : ${t.repr()}`),
    ]
    let s = parts.join("\n")
    return `{\n${ut.indent(s, "  ")}\n}`
  },
})

const cls_alpha_repr = (
  sat: Array<{ name: string; t: Exp; exp: Exp }>,
  scope: Array<{ name: string; t: Exp }>
): AlphaRepr => ({
  alpha_repr: (opts) => {
    if (sat.length === 0 && scope.length === 0) return "Object"
    const parts = []
    let new_alpha_ctx = opts
    for (const { name, t, exp } of sat) {
      const t_repr = t.alpha_repr(new_alpha_ctx)
      const exp_repr = exp.alpha_repr(new_alpha_ctx)
      parts.push(`${name} : ${t_repr} = ${exp_repr}`)
      new_alpha_ctx = {
        depth: new_alpha_ctx.depth + 1,
        depths: new Map([...new_alpha_ctx.depths, [name, new_alpha_ctx.depth]]),
      }
    }
    for (const { name, t } of scope) {
      const t_repr = t.alpha_repr(new_alpha_ctx)
      parts.push(`${name} : ${t_repr}`)
      new_alpha_ctx = {
        depth: new_alpha_ctx.depth + 1,
        depths: new Map([...new_alpha_ctx.depths, [name, new_alpha_ctx.depth]]),
      }
    }
    let s = parts.join("\n")
    return `{\n${ut.indent(s, "  ")}\n}`
  },
})
