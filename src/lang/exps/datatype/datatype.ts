import { Exp, ExpMeta, ElaborationOptions, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { check } from "../../exp"
import * as Exps from "../../exps"
import * as ut from "../../../ut"

export class Datatype extends Exp {
  name: string
  parameters: Record<string, Exp>
  indexes: Record<string, Exp>
  ctors: Record<string, Exp>

  constructor(
    name: string,
    parameters: Record<string, Exp>,
    indexes: Record<string, Exp>,
    ctors: Record<string, Exp>
  ) {
    super()
    this.name = name
    this.parameters = parameters
    this.indexes = indexes
    this.ctors = ctors
  }

  free_names(bound_names: Set<string>): Set<string> {
    const parameters = this.parameters_free_names(bound_names)

    return new Set([
      ...parameters.free_names,
      ...this.indexes_free_names(parameters.bound_names),
      ...this.ctors_free_names(new Set([...parameters.bound_names, this.name])),
    ])
  }

  parameters_free_names(bound_names: Set<string>): {
    bound_names: Set<string>
    free_names: Set<string>
  } {
    let free_names: Set<string> = new Set()
    for (const [name, exp] of Object.entries(this.parameters)) {
      free_names = new Set([...free_names, ...exp.free_names(bound_names)])
      bound_names = new Set([...bound_names, name])
    }

    return { free_names, bound_names }
  }

  indexes_free_names(bound_names: Set<string>): Set<string> {
    // NOTE The `indexes` will not be in scope in constructor definitions,
    //   thus we do not need to return new `bound_names`.

    let free_names: Set<string> = new Set()
    for (const [name, exp] of Object.entries(this.indexes)) {
      free_names = new Set([...free_names, ...exp.free_names(bound_names)])
      bound_names = new Set([...bound_names, name])
    }

    return free_names
  }

  ctors_free_names(bound_names: Set<string>): Set<string> {
    let free_names: Set<string> = new Set()

    for (const exp of Object.values(this.ctors)) {
      free_names = new Set([...free_names, ...exp.free_names(bound_names)])
    }

    return free_names
  }

  subst(name: string, exp: Exp): Exp {
    // NOTE datatype will always at top-level.
    //   thus not need to subst.
    return this
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    // NOTE The `name` and `parameters` are in scope when inferring `ctors`.
    throw new Error("TODO")
  }

  repr(): string {
    const n = this.name
    const p = this.parameters_repr()
    const i = this.indexes_repr()
    const head = `datatype ${n} ${p}${i}`
    const c = this.ctors_repr()
    const body = ut.indent(c, "  ")
    return `${head}{\n${body}\n}`
  }

  parameters_repr(): string {
    if (Object.entries(this.parameters).length > 0) {
      return (
        "(" +
        Object.entries(this.parameters)
          .map(([name, t]) => `${name}: ${t.repr()}`)
          .join(", ") +
        ") "
      )
    } else if (Object.entries(this.indexes).length > 0) {
      return "() "
    } else {
      return ""
    }
  }

  indexes_repr(): string {
    if (Object.entries(this.indexes).length > 0) {
      return (
        "(" +
        Object.entries(this.indexes)
          .map(([name, t]) => `${name}: ${t.repr()}`)
          .join(", ") +
        ") "
      )
    } else {
      return ""
    }
  }

  ctors_repr(): string {
    return Object.entries(this.ctors)
      .map(([name, t]) => `${name}: ${t.repr()}`)
      .join("\n")
  }
}
