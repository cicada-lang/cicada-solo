import { Ctx } from "../ctx"
import { Value, readback } from "../value"
import { Core } from "../core"
import * as Exps from "../exps"
import { Trace } from "../errors"

export function unify(subst: Subst, x: Value, y: Value): Subst | null {
  x = subst.walk(x)
  y = subst.walk(y)

  if (logic_var_p(y)) {
    // NOTE When implementing unify for a `Value` subclass,
    //   the case where the argument is a logic variable is already handled.
    return y.unify(subst, x)
  } else {
    return x.unify(subst, y)
  }
}

export function solve(
  ctx: Ctx,
  x: Value,
  y: Value,
  logic_var_t: Value,
  logic_var: Exps.NotYetValue
): { value: Value; core: Core } {
  const subst = unify(Subst.create(), x, y)
  if (subst === null) {
    const logic_var_repr = readback(ctx, logic_var_t, logic_var).repr()
    throw new Trace(
      `Unification fail, fail to solve logic variable: ${logic_var_repr}`
    )
  }

  const value = subst.find(logic_var_name(logic_var))
  if (value === undefined) {
    const logic_var_repr = readback(ctx, logic_var_t, logic_var).repr()
    throw new Trace(`Fail to solve logic variable: ${logic_var_repr}`)
  }

  return {
    value,
    core: readback(ctx, logic_var_t, value),
  }
}

export function logic_var_p(value: Value): boolean {
  return (
    value instanceof Exps.NotYetValue &&
    value.neutral instanceof Exps.VarNeutral
  )
}

export function logic_var_name(value: Value): string {
  if (
    value instanceof Exps.NotYetValue &&
    value.neutral instanceof Exps.VarNeutral
  ) {
    return value.neutral.name
  } else {
    throw new Error("Expecting value to be logic variable")
  }
}

export class Subst {
  // NOTE no side-effect

  private map: Map<string, Value>

  constructor(map: Map<string, Value>) {
    this.map = map
  }

  static create(): Subst {
    const map = new Map()
    return new Subst(map)
  }

  clone(): Subst {
    const map = new Map(this.map)
    return new Subst(map)
  }

  extend(name: string, value: Value): Subst {
    const subst = this.clone()
    subst.map.set(name, value)
    return subst
  }

  find(name: string): Value | undefined {
    return this.map.get(name)
  }

  walk(value: Value): Value {
    while (logic_var_p(value)) {
      const found = this.find(logic_var_name(value))
      if (found === undefined) {
        return value
      } else {
        value = found
      }
    }

    return value
  }
}
