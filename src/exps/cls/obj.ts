import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value, match_value } from "../../value"
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

  check(ctx: Ctx, t: Value): Core {
    const properties = new Map(
      this.properties.flatMap((prop) => prop.expand(ctx))
    )

    if (t instanceof Cores.ClsValue) {
      const cls = t
      const core_properties = cls.telescope.check_properties(ctx, properties)
      return new Cores.Obj(core_properties)
    }

    if (t instanceof Cores.ExtValue) {
      const ext = t
      let core_properties: Map<string, Core> = new Map()
      for (const { telescope } of ext.entries) {
        core_properties = new Map([
          ...core_properties,
          ...telescope.check_properties(ctx, properties),
        ])
      }

      return new Cores.Obj(core_properties)
    }

    throw new Trace(`Expecting t to be ClsValue or ExtValue`)
  }

  repr(): string {
    const s = this.properties.map((prop) => prop.repr()).join("\n")
    return `{\n${ut.indent(s, "  ")}\n}`
  }
}

export abstract class Prop {
  instanceofProp = true

  abstract expand(ctx: Ctx): Array<[string, Exp]>
  abstract repr(): string
}

export class SpreadProp extends Prop {
  exp: Exp

  constructor(exp: Exp) {
    super()
    this.exp = exp
  }

  expand(ctx: Ctx): Array<[string, Exp]> {
    const inferred = infer(ctx, this.exp)
    return match_value(inferred.t, [
      [
        Cores.ExtValue,
        (ext: Cores.ExtValue) =>
          ext.names.map((name) => [name, new Exps.Dot(this.exp, name)]),
      ],
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

  expand(ctx: Ctx): Array<[string, Exp]> {
    return [[this.name, new Exps.Var(this.name)]]
  }

  repr(): string {
    return `${this.name}`
  }
}
