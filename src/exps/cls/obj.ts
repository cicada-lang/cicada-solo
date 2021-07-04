import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value, expect } from "../../value"
import { Trace } from "../../errors"
import { infer } from "../../exp"
import * as ut from "../../ut"
import * as Exps from "../../exps"

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

  private check_duplicated_field_name(ctx: Ctx): void {
    const field_names = this.properties.flatMap((prop) =>
      prop.to_entries(ctx).map(([name]) => name)
    )

    const occurred = new Set()

    for (const field_name of field_names) {
      if (occurred.has(field_name)) {
        throw new Trace(
          [
            `I found duplicated field name in object`,
            `field name:`,
            `  ${field_name}`,
            `field name list:`,
            `  ${field_names.join(", ")}`,
          ].join("\n")
        )
      } else {
        occurred.add(field_name)
      }
    }
  }

  check(ctx: Ctx, t: Value): Core {
    const properties = new Map(
      this.properties.flatMap((prop) => prop.to_entries(ctx))
    )

    this.check_duplicated_field_name(ctx)

    if (t instanceof Exps.ClsValue) {
      const core_properties = t.check_properties(ctx, properties)
      return new Exps.ObjCore(core_properties)
    }

    throw new Trace(
      [
        `I expect t to be ClsValue`,
        `but the constructor name I meet is: ${t.constructor.name}`,
      ].join("\n") + "\n"
    )
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
  abstract to_entries(ctx: Ctx): Array<[string, Exp]>
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

  to_entries(ctx: Ctx): Array<[string, Exp]> {
    const inferred = infer(ctx, this.exp)

    if (inferred.t instanceof Exps.ClsValue) {
      const cls = inferred.t
      return cls.field_names.map((name) => [name, new Exps.Dot(this.exp, name)])
    }

    throw new Trace(
      [
        `I expect inferred.t to be an instance of ClsValue`,
        `but the constructor name I meet is: ${inferred.t.constructor.name}`,
      ].join("\n") + "\n"
    )
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

  to_entries(ctx: Ctx): Array<[string, Exp]> {
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

  to_entries(ctx: Ctx): Array<[string, Exp]> {
    return [[this.name, new Exps.Var(this.name)]]
  }

  repr(): string {
    return `${this.name}`
  }
}
