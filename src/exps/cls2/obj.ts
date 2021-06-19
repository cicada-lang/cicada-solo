import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Trace } from "../../trace"
import { infer } from "../../infer"
import * as ut from "../../ut"
import * as Exps from "../../exps"
import * as Cores from "../../cores"

export class Obj2 extends Exp {
  properties: Array<Prop2>

  constructor(properties: Array<Prop2>) {
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
    return new Obj2(
      this.properties.map((property) => property.subst(name, exp))
    )
  }

  check(ctx: Ctx, t: Value): Core {
    const properties = new Map(
      this.properties.flatMap((prop) => prop.expand(ctx))
    )

    // NOTE TODO SpreadProp2 might introduce new property name, thus new scope.

    if (t instanceof Cores.Cls2Value) {
      const core_properties = t.check_properties(ctx, properties)
      return new Cores.Obj2(core_properties)
    }

    throw new Trace(`Expecting t to be ClsValue`)
  }

  repr(): string {
    const s = this.properties.map((prop) => prop.repr()).join("\n")
    return `{\n${ut.indent(s, "  ")}\n}`
  }
}

export abstract class Prop2 {
  instanceofProp2 = true

  abstract free_names(bound_names: Set<string>): Set<string>
  abstract subst(name: string, exp: Exp): Prop2
  abstract expand(ctx: Ctx): Array<[string, Exp]>
  abstract repr(): string
}

export class SpreadProp2 extends Prop2 {
  exp: Exp

  constructor(exp: Exp) {
    super()
    this.exp = exp
  }

  free_names(bound_names: Set<string>): Set<string> {
    return this.exp.free_names(bound_names)
  }

  subst(name: string, exp: Exp): Prop2 {
    return new SpreadProp2(this.exp.subst(name, exp))
  }

  expand(ctx: Ctx): Array<[string, Exp]> {
    const inferred = infer(ctx, this.exp)
    return Value.match(inferred.t, [
      [
        Cores.ClsNilValue,
        (cls: Cores.ClsNilValue) =>
          cls.names.map((name) => [name, new Exps.Dot(this.exp, name)]),
      ],
      [
        Cores.ClsConsValue,
        (cls: Cores.ClsConsValue) =>
          cls.names.map((name) => [name, new Exps.Dot(this.exp, name)]),
      ],
    ])
  }

  repr(): string {
    return `...${this.exp.repr()}`
  }
}

export class FieldProp2 extends Prop2 {
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

  subst(name: string, exp: Exp): Prop2 {
    return new FieldProp2(this.name, this.exp.subst(name, exp))
  }

  expand(ctx: Ctx): Array<[string, Exp]> {
    return [[this.name, this.exp]]
  }

  repr(): string {
    return `${this.name}: ${this.exp.repr()}`
  }
}

export class FieldShorthandProp2 extends Prop2 {
  name: string

  constructor(name: string) {
    super()
    this.name = name
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Exps.Var(this.name).free_names(bound_names)
  }

  subst(name: string, exp: Exp): Prop2 {
    return this
  }

  expand(ctx: Ctx): Array<[string, Exp]> {
    return [[this.name, new Exps.Var(this.name)]]
  }

  repr(): string {
    return `${this.name}`
  }
}
