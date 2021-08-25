import { Ctx } from "../ctx"
import { Value, readback } from "../value"
import { Core } from "../core"
import * as Exps from "../exps"
import { Trace } from "../errors"

export class Subst {
  // NOTE no side-effect

  private map: Map<string, Value>

  constructor(map: Map<string, Value>) {
    this.map = map
  }

  static logic_var_p(value: Value): boolean {
    return (
      value instanceof Exps.NotYetValue &&
      value.neutral instanceof Exps.VarNeutral
    )
  }

  static logic_var_name(value: Value): string {
    if (
      value instanceof Exps.NotYetValue &&
      value.neutral instanceof Exps.VarNeutral
    ) {
      return value.neutral.name
    } else {
      throw new Error("Expecting value to be logic variable")
    }
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
    while (Subst.logic_var_p(value)) {
      const found = this.find(Subst.logic_var_name(value))
      if (found === undefined) {
        return value
      } else {
        value = found
      }
    }

    return value
  }

  unify(x: Value, y: Value): Subst | null {
    x = this.walk(x)
    y = this.walk(y)

    if (Subst.logic_var_p(x) && Subst.logic_var_p(y)) {
      if (Subst.logic_var_name(x) === Subst.logic_var_name(x)) {
        return this
      } else {
        return null
      }
    } else if (Subst.logic_var_p(x)) {
      // TODO occur check
      return this.extend(Subst.logic_var_name(x), y)
    } else if (Subst.logic_var_p(y)) {
      // TODO occur check
      return this.extend(Subst.logic_var_name(y), x)
    } else {
      // NOTE When implementing unify for a `Value` subclass,
      //   the case where the argument is a logic variable is already handled.
      return x.unify(this, y)
    }
  }
}
