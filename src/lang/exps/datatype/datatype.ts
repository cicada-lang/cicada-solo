import { Exp, ExpMeta, ElaborationOptions, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { check } from "../../exp"
import * as Exps from "../../exps"

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
    let free_names: Set<string> = new Set()

    for (const [name, exp] of Object.entries(this.parameters)) {
      free_names = new Set([...free_names, ...exp.free_names(bound_names)])
      bound_names = new Set([...bound_names, name])
    }

    // NOTE The `indexes` will not be in scope in constructor definitions.
    let indexes_bound_names = bound_names
    for (const [name, exp] of Object.entries(this.indexes)) {
      free_names = new Set([...free_names, ...exp.free_names(indexes_bound_names)])
      indexes_bound_names = new Set([...indexes_bound_names, name])
    }

    bound_names = new Set([...bound_names, this.name])

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
    throw new Error("TODO")
  }

  repr(): string {
    return "TODO"
  }
}
