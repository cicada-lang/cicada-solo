import { Exp, ExpMeta, ElaborationOptions, subst } from "../../exp"
import { Core } from "../../core"
import { evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { check } from "../../exp"
import * as Exps from "../../exps"
import * as ut from "../../../ut"

export class TypeCtor extends Exp {
  name: string
  fixed: Record<string, Exp>
  indexes: Record<string, Exp>
  ctors: Record<string, Exp>

  constructor(
    name: string,
    fixed: Record<string, Exp>,
    indexes: Record<string, Exp>,
    ctors: Record<string, Exp>
  ) {
    super()
    this.name = name
    this.fixed = fixed
    this.indexes = indexes
    this.ctors = ctors
  }

  free_names(bound_names: Set<string>): Set<string> {
    const result = this.fixed_free_names(bound_names)

    return new Set([
      ...result.free_names,
      ...this.indexes_free_names(result.bound_names),
      ...this.ctors_free_names(new Set([...result.bound_names, this.name])),
    ])
  }

  private fixed_free_names(bound_names: Set<string>): {
    bound_names: Set<string>
    free_names: Set<string>
  } {
    let free_names: Set<string> = new Set()
    for (const [name, exp] of Object.entries(this.fixed)) {
      free_names = new Set([...free_names, ...exp.free_names(bound_names)])
      bound_names = new Set([...bound_names, name])
    }

    return { free_names, bound_names }
  }

  private indexes_free_names(bound_names: Set<string>): Set<string> {
    // NOTE The `indexes` will not be in scope in constructor definitions,
    //   thus we do not need to return new `bound_names`.
    let free_names: Set<string> = new Set()
    for (const [name, exp] of Object.entries(this.indexes)) {
      free_names = new Set([...free_names, ...exp.free_names(bound_names)])
      bound_names = new Set([...bound_names, name])
    }

    return free_names
  }

  private ctors_free_names(bound_names: Set<string>): Set<string> {
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
    const result = this.infer_fixed(ctx)
    const indexes = this.infer_indexes(result.ctx)
    const self_type = evaluate(
      ctx.to_env(),
      TypeCtor.self_type_core(result.fixed, indexes)
    )
    const ctors = this.infer_ctors(result.ctx.extend(this.name, self_type))

    return {
      t: self_type,
      core: new Exps.TypeCtorCore(this.name, result.fixed, indexes, ctors),
    }
  }

  private infer_fixed(ctx: Ctx): {
    fixed: Record<string, Core>
    ctx: Ctx
  } {
    const fixed: Record<string, Core> = {}
    for (const [name, t] of Object.entries(this.fixed)) {
      const core = check(ctx, t, new Exps.TypeValue())
      fixed[name] = core
      ctx = ctx.extend(name, evaluate(ctx.to_env(), core))
    }

    return { fixed, ctx }
  }

  private infer_indexes(ctx: Ctx): Record<string, Core> {
    const indexes: Record<string, Core> = {}
    for (const [name, t] of Object.entries(this.indexes)) {
      const core = check(ctx, t, new Exps.TypeValue())
      indexes[name] = core
      ctx = ctx.extend(name, evaluate(ctx.to_env(), core))
    }

    return indexes
  }

  static self_type_core(
    fixed: Record<string, Core>,
    indexes: Record<string, Core>
  ): Core {
    return [...Object.entries(fixed), ...Object.entries(indexes)]
      .reverse()
      .reduce(
        (result, [name, t]) => new Exps.PiCore(name, t, result),
        new Exps.TypeCore()
      )
  }

  private infer_ctors(ctx: Ctx): Record<string, Core> {
    const ctors: Record<string, Core> = {}
    for (const [name, t] of Object.entries(this.ctors)) {
      ctors[name] = check(ctx, t, new Exps.TypeValue())
    }

    return ctors
  }

  repr(): string {
    const n = this.name
    const p = this.fixed_repr()
    const i = this.indexes_repr()
    const head = `datatype ${n} ${p}${i}`
    const c = this.ctors_repr()
    const body = ut.indent(c, "  ")
    return `${head}{\n${body}\n}`
  }

  private fixed_repr(): string {
    if (Object.entries(this.fixed).length > 0) {
      return (
        "(" +
        Object.entries(this.fixed)
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

  private indexes_repr(): string {
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

  private ctors_repr(): string {
    return Object.entries(this.ctors)
      .map(([name, t]) => `${name}: ${t.repr()}`)
      .join("\n")
  }
}
