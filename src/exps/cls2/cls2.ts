import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { check } from "../../check"
import { evaluate } from "../../evaluate"
import { Value } from "../../value"
import * as Cores from "../../cores"
import * as Exps from "../../exps"
import * as ut from "../../ut"

export abstract class Cls2 extends Exp {
  abstract fields_repr(): Array<string>
  abstract subst(name: string, exp: Exp): Cls2
}

export class ClsNil extends Cls2 {
  free_names(bound_names: Set<string>): Set<string> {
    return new Set()
  }

  subst(name: string, exp: Exp): Cls2 {
    return this
  }

  fields_repr(): Array<string> {
    return []
  }

  repr(): string {
    return `{}`
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    throw new Error()
  }
}

export class ClsCons extends Cls2 {
  field_name: string
  local_name: string
  field_t: Exp
  rest_t: Cls2

  constructor(
    field_name: string,
    local_name: string,
    field_t: Exp,
    rest_t: Cls2
  ) {
    super()
    this.field_name = field_name
    this.local_name = local_name
    this.field_t = field_t
    this.rest_t = rest_t
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.field_t.free_names(bound_names),
      ...this.rest_t.free_names(new Set([...bound_names, this.local_name])),
    ])
  }

  subst(name: string, exp: Exp): Cls2 {
    if (name === this.local_name) {
      return new ClsCons(
        this.field_name,
        this.local_name,
        this.field_t.subst(name, exp),
        this.rest_t
      )
    } else {
      const free_names = exp.free_names(new Set())
      const fresh_name = ut.freshen_name(free_names, this.local_name)

      return new ClsCons(
        this.field_name,
        fresh_name,
        this.field_t.subst(name, exp),
        this.rest_t
          .subst(this.local_name, new Exps.Var(fresh_name))
          .subst(name, exp)
      )
    }
  }

  fields_repr(): Array<string> {
    return [
      `${this.field_name}: ${this.field_t.repr()}`,
      ...this.rest_t.fields_repr(),
    ]
  }

  repr(): string {
    const fields = this.fields_repr().join()
    return `{\n${ut.indent(fields, "  ")}\n}`
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    throw new Error()
  }
}
