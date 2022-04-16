import { Value } from "../value"

export abstract class Env {
  abstract findValue(name: string): undefined | Value
  abstract remove(name: string): Env

  static init(): EmptyEnv {
    return new EmptyEnv()
  }

  extend(name: string, value: Value): Env {
    return new ExtendEnv(name, value, this)
  }
}

class ExtendEnv extends Env {
  constructor(public name: string, public value: Value, public rest: Env) {
    super()
  }

  findValue(name: string): undefined | Value {
    if (name === this.name) {
      return this.value
    } else {
      return this.rest.findValue(name)
    }
  }

  remove(name: string): Env {
    if (this.name === name) {
      return this.rest
    } else {
      return new ExtendEnv(this.name, this.value, this.rest.remove(name))
    }
  }
}

class EmptyEnv extends Env {
  findValue(name: string): undefined | Value {
    return undefined
  }

  remove(name: string): Env {
    return this
  }
}
