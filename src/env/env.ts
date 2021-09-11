import { Value } from "../value"

export abstract class Env {
  abstract lookup_value(name: string): undefined | Value

  static get empty(): EmptyEnv {
    return new EmptyEnv()
  }

  extend(name: string, value: Value): Env {
    return new ConsEnv(name, value, this)
  }
}

class ConsEnv extends Env {
  name: string
  value: Value
  rest: Env

  constructor(name: string, value: Value, rest: Env) {
    super()
    this.name = name
    this.value = value
    this.rest = rest
  }

  lookup_value(name: string): undefined | Value {
    if (name === this.name) {
      return this.value
    } else {
      return this.rest.lookup_value(name)
    }
  }
}

class EmptyEnv extends Env {
  lookup_value(name: string): undefined | Value {
    return undefined
  }
}
