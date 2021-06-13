import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Trace } from "../../trace"
import { infer } from "../../infer"
import * as ut from "../../ut"
import * as Exps from "../../exps"
import * as Cores from "../../cores"

export class Obj extends Exp {
  properties: Array<Prop>

  constructor(properties: Array<Prop>) {
    super()
    this.properties = properties
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set(
      this.properties.flatMap((property) =>
        Array.from(property.free_names(bound_names))
      )
    )
  }

  subst(name: string, exp: Exp): Exp {
    return new Obj(this.properties.map((property) => property.subst(name, exp)))
  }

  check(ctx: Ctx, t: Value): Core {
    const properties = new Map(
      this.properties.flatMap((prop) => prop.expand(ctx))
    )

    if (t instanceof Cores.ClsValue) {
      const core_properties = t.check_properties(ctx, properties)
      return new Cores.Obj(core_properties)
    }

    throw new Trace(`Expecting t to be ClsValue`)
  }

  repr(): string {
    const s = this.properties.map((prop) => prop.repr()).join("\n")
    return `{\n${ut.indent(s, "  ")}\n}`
  }
}

export abstract class Prop {
  instanceofProp = true

  abstract free_names(bound_names: Set<string>): Set<string>
  abstract subst(name: string, exp: Exp): Prop
  abstract expand(ctx: Ctx): Array<[string, Exp]>
  abstract repr(): string
}

export class SpreadProp extends Prop {
  exp: Exp

  constructor(exp: Exp) {
    super()
    this.exp = exp
  }

  free_names(bound_names: Set<string>): Set<string> {
    return this.exp.free_names(bound_names)
  }

  subst(name: string, exp: Exp): Prop {
    return new SpreadProp(this.exp.subst(name, exp))
  }

  expand(ctx: Ctx): Array<[string, Exp]> {
    const inferred = infer(ctx, this.exp)
    return Value.match(inferred.t, [
      [
        Cores.ClsValue,
        (cls: Cores.ClsValue) =>
          cls.names.map((name) => [name, new Exps.Dot(this.exp, name)]),
      ],
    ])
  }

  repr(): string {
    return `...${this.exp.repr()}`
  }
}

export class FieldProp extends Prop {
  name: string
  exp: Exp

  constructor(name: string, exp: Exp) {
    super()
    this.name = name
    this.exp = exp
  }

  free_names(bound_names: Set<string>): Set<string> {
    return this.exp.free_names(bound_names)
  }

  subst(name: string, exp: Exp): Prop {
    return new FieldProp(this.name, this.exp.subst(name, exp))
  }

  expand(ctx: Ctx): Array<[string, Exp]> {
    return [[this.name, this.exp]]
  }

  repr(): string {
    return `${this.name}: ${this.exp.repr()}`
  }
}

export class FieldShorthandProp extends Prop {
  name: string

  constructor(name: string) {
    super()
    this.name = name
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Exps.Var(this.name).free_names(bound_names)
  }

  subst(name: string, exp: Exp): Prop {
    return this
  }

  expand(ctx: Ctx): Array<[string, Exp]> {
    return [[this.name, new Exps.Var(this.name)]]
  }

  repr(): string {
    return `${this.name}`
  }
}
