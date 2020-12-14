import { Evaluable } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Inferable } from "../../inferable"
import { Exp } from "../../exp"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"
import * as ut from "../../../ut"
import { obj_evaluable } from "./obj-evaluable"
import { obj_checkable } from "./obj-checkable"
import { obj_inferable } from "./obj-inferable"

export type Obj = Exp & {
  kind: "Exp.obj"
  properties: Map<string, Exp>
}

export function Obj(properties: Map<string, Exp>): Obj {
  return {
    kind: "Exp.obj",
    properties,
    ...obj_evaluable(properties),
    ...obj_inferable(properties),
    ...obj_checkable(properties),
    ...obj_repr(properties),
    ...obj_alpha_repr(properties),
  }
}

const obj_repr = (properties: Map<string, Exp>) => ({
  repr: () => {
    const s = Array.from(properties)
      .map(([name, exp]) => `${name} = ${exp.repr()}`)
      .join("\n")
    return `{\n${ut.indent(s, "  ")}\n}`
  },
})

const obj_alpha_repr = (properties: Map<string, Exp>): AlphaRepr => ({
  alpha_repr: (opts) => {
    const s = Array.from(properties)
      .map(([name, exp]) => `${name} = ${exp.alpha_repr(opts)}`)
      .join("\n")
    return `{\n${ut.indent(s, "  ")}\n}`
  },
})
