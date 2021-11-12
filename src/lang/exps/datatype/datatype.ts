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
    throw new Error("TODO")
  }

  subst(name: string, exp: Exp): Exp {
    throw new Error("TODO")
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    throw new Error("TODO")
  }

  repr(): string {
    return "TODO"
  }
}
