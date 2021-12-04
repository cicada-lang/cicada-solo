import { Exp, ExpMeta, subst } from "../../exp"
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
  varied: Record<string, Exp>
  data_ctors: Record<string, Exp>

  constructor(
    name: string,
    fixed: Record<string, Exp>,
    varied: Record<string, Exp>,
    data_ctors: Record<string, Exp>
  ) {
    super()
    this.name = name
    this.fixed = fixed
    this.varied = varied
    this.data_ctors = data_ctors
  }

  free_names(bound_names: Set<string>): Set<string> {
    const result = this.fixed_free_names(bound_names)

    return new Set([
      ...result.free_names,
      ...this.varied_free_names(result.bound_names),
      ...this.data_ctors_free_names(
        new Set([...result.bound_names, this.name])
      ),
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

  private varied_free_names(bound_names: Set<string>): Set<string> {
    // NOTE The `varied` will not be in scope in constructor definitions,
    //   thus we do not need to return new `bound_names`.
    let free_names: Set<string> = new Set()
    for (const [name, exp] of Object.entries(this.varied)) {
      free_names = new Set([...free_names, ...exp.free_names(bound_names)])
      bound_names = new Set([...bound_names, name])
    }

    return free_names
  }

  private data_ctors_free_names(bound_names: Set<string>): Set<string> {
    let free_names: Set<string> = new Set()
    for (const exp of Object.values(this.data_ctors)) {
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
    const varied = this.infer_varied(result.ctx)
    const self_type = evaluate(
      ctx.to_env(),
      TypeCtor.self_type_core(result.fixed, varied)
    )
    const data_ctors = this.infer_data_ctors(
      result.ctx.extend(this.name, self_type)
    )

    return {
      t: self_type,
      core: new Exps.TypeCtorCore(this.name, result.fixed, varied, data_ctors),
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

  private infer_varied(ctx: Ctx): Record<string, Core> {
    const varied: Record<string, Core> = {}
    for (const [name, t] of Object.entries(this.varied)) {
      const core = check(ctx, t, new Exps.TypeValue())
      varied[name] = core
      ctx = ctx.extend(name, evaluate(ctx.to_env(), core))
    }

    return varied
  }

  static self_type_core(
    fixed: Record<string, Core>,
    varied: Record<string, Core>
  ): Core {
    return [...Object.entries(fixed), ...Object.entries(varied)]
      .reverse()
      .reduce(
        (result, [name, t]) => new Exps.PiCore(name, t, result),
        new Exps.TypeCore()
      )
  }

  private infer_data_ctors(ctx: Ctx): Record<string, Core> {
    const data_ctors: Record<string, Core> = {}
    for (const [name, t] of Object.entries(this.data_ctors)) {
      data_ctors[name] = check(ctx, t, new Exps.TypeValue())
    }

    return data_ctors
  }

  format(): string {
    const n = this.name
    const p = this.fixed_format()
    const i = this.varied_format()
    const head = `datatype ${n} ${p}${i}`
    const c = this.data_ctors_format()
    const body = ut.indent(c, "  ")
    return `${head}{\n${body}\n}`
  }

  private fixed_format(): string {
    if (Object.entries(this.fixed).length > 0) {
      return (
        "(" +
        Object.entries(this.fixed)
          .map(([name, t]) => `${name}: ${t.format()}`)
          .join(", ") +
        ") "
      )
    } else if (Object.entries(this.varied).length > 0) {
      return "() "
    } else {
      return ""
    }
  }

  private varied_format(): string {
    if (Object.entries(this.varied).length > 0) {
      return (
        "(" +
        Object.entries(this.varied)
          .map(([name, t]) => `${name}: ${t.format()}`)
          .join(", ") +
        ") "
      )
    } else {
      return ""
    }
  }

  private data_ctors_format(): string {
    return Object.entries(this.data_ctors)
      .map(([name, t]) => `${name}: ${t.format()}`)
      .join("\n")
  }
}
