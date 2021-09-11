import { Value } from "../value"
import * as Exps from "../exps"

export abstract class Subst {
  abstract extend(name: string, value: Value): Subst
  abstract find(name: string): Value | undefined
  abstract names: Array<string>

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

  static get empty(): EmptySubst {
    return new EmptySubst()
  }

  static empty_p(subst: Subst): subst is EmptySubst {
    return subst instanceof EmptySubst
  }

  static get failure(): FailureSubst {
    return new FailureSubst()
  }

  static failure_p(subst: Subst): subst is FailureSubst {
    return subst instanceof FailureSubst
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

  unify(x: Value, y: Value): Subst {
    x = this.walk(x)
    y = this.walk(y)

    if (Subst.logic_var_p(x) && Subst.logic_var_p(y)) {
      if (Subst.logic_var_name(x) === Subst.logic_var_name(x)) {
        return this
      } else {
        return Subst.failure
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

class ExtendSubst extends Subst {
  // TODO Should `Subst` also contains type of value -- like `Ctx`?
  name: string
  value: Value
  rest: Subst

  constructor(name: string, value: Value, rest: Subst) {
    super()
    this.name = name
    this.value = value
    this.rest = rest
  }

  get names(): Array<string> {
    return [this.name, ...this.rest.names]
  }

  extend(name: string, value: Value): Subst {
    return new ExtendSubst(name, value, this)
  }

  find(name: string): Value | undefined {
    if (name === this.name) {
      return this.value
    } else {
      return this.rest.find(name)
    }
  }
}

class EmptySubst extends Subst {
  names = []

  extend(name: string, value: Value): Subst {
    return new ExtendSubst(name, value, this)
  }

  find(name: string): Value | undefined {
    return undefined
  }
}

class FailureSubst extends Subst {
  names = []

  extend(name: string, value: Value): Subst {
    return this
  }

  find(name: string): Value | undefined {
    throw new Error(`Can not find name: ${name}, from a FailureSubst.`)
  }
}
