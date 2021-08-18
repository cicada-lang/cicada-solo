import { Ctx } from "../ctx"
import { Value, readback } from "../value"
import { Core } from "../core"
import * as Exps from "../exps"
import { Trace } from "../errors"

export function unify(ctx: Ctx, x: Value, y: Value): Ctx {
  return ctx
}

export function solve(
  ctx: Ctx,
  x: Value,
  y: Value,
  logic_t: Value,
  name: string
): { value: Value; core: Core } {
  ctx = unify(ctx, x, y)
  const entry = ctx.lookup_entry(name)
  if (entry === undefined || entry.value === undefined) {
    throw new Trace(`Fail to solve logic variable name: ${name}`)
  }

  return {
    value: entry.value,
    core: readback(ctx, logic_t, entry.value),
  }
}
