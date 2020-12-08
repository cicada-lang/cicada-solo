import { evaluator } from "../../evaluator"
import { Evaluable, EvaluationMode } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Exp } from "../../exp"
import { Repr } from "../../repr"
import * as Evaluate from "../../evaluate"
import * as Readback from "../../readback"
import * as Check from "../../check"
import * as Explain from "../../explain"
import * as Value from "../../value"
import * as Pattern from "../../pattern"
import * as Neutral from "../../neutral"
import * as Mod from "../../mod"
import * as Ctx from "../../ctx"
import * as Env from "../../env"
import * as Trace from "../../../trace"
import * as ut from "../../../ut"

export type Obj = Evaluable &
  Checkable &
  Repr & {
    kind: "Exp.obj"
    properties: Map<string, Exp>
  }

export function Obj(properties: Map<string, Exp>): Obj {
  return {
    kind: "Exp.obj",
    properties,
    evaluability: ({ mod, env, mode, evaluator }) =>
      Value.obj(
        new Map(
          Array.from(properties, ([name, exp]) => [
            name,
            evaluator.evaluate(exp, { mod, env, mode }),
          ])
        )
      ),
    repr: () => {
      const s = Array.from(properties)
        .map(([name, exp]) => `${name} = ${exp.repr()}`)
        .join("\n")
      return `{\n${ut.indent(s, "  ")}\n}`
    },
    checkability: (t, { mod, ctx }) => {
      const cls = Value.is_cls(mod, ctx, t)
      // NOTE We DO NOT need to update the `ctx` as we go along.
      // - just like checking `Exp.cons`.
      properties = new Map(properties)
      check_properties_aganst_sat(mod, ctx, properties, cls.sat)
      check_properties_aganst_tel(mod, ctx, properties, cls.tel)
    },
  }
}

function check_properties_aganst_sat(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  properties: Map<string, Exp>,
  sat: Array<{ name: string; t: Value.Value; value: Value.Value }>
): void {
  for (const entry of sat) {
    const found = properties.get(entry.name)
    if (found === undefined) {
      throw new Trace.Trace(
        ut.aline(`
          |Can not found satisfied entry name: ${entry.name}
          |`)
      )
    }
    Check.check(mod, ctx, found, entry.t)
    const value = evaluator.evaluate(found, { mod, env: Ctx.to_env(ctx) })
    if (!Value.conversion(mod, ctx, entry.t, value, entry.value)) {
      throw new Trace.Trace(
        ut.aline(`
          |I am expecting the following two values to be the same ${Readback.readback(
            mod,
            ctx,
            Value.type,
            entry.t
          ).repr()}.
          |But they are not.
          |The value in object:
          |  ${Readback.readback(mod, ctx, entry.t, value).repr()}
          |The value in partially filled class:
          |  ${Readback.readback(mod, ctx, entry.t, entry.value).repr()}
          |`)
      )
    }
    properties.delete(entry.name)
  }
}

function check_properties_aganst_tel(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  properties: Map<string, Exp>,
  tel: Value.Telescope.Telescope
): void {
  if (tel.next === undefined) return
  const next_value = check_properties_aganst_next(
    mod,
    ctx,
    properties,
    tel.next
  )
  const filled_tel = Value.Telescope.fill(tel, next_value)
  Check.check(mod, ctx, Obj(properties), Value.cls([], filled_tel))
}

function check_properties_aganst_next(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  properties: Map<string, Exp>,
  next: { name: string; t: Value.Value }
): Value.Value {
  const found = properties.get(next.name)
  if (found === undefined) {
    throw new Trace.Trace(
      ut.aline(`
        |Can not found next name: ${next.name}
        |`)
    )
  }
  Check.check(mod, ctx, found, next.t)
  properties.delete(next.name)
  return evaluator.evaluate(found, { mod, env: Ctx.to_env(ctx) })
}
