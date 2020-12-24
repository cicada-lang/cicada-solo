import { ValueStack } from "../value-stack"
import { Value } from "../value"
import { JoJo } from "../jos/jojo"
import { Env } from "../env"
import { Mod, Triplex } from "../mod"

export class World {
  env: Env
  mod: Mod
  value_stack: ValueStack

  constructor(the: { env: Env; mod: Mod; value_stack: ValueStack }) {
    this.env = the.env
    this.mod = the.mod
    this.value_stack = the.value_stack
  }

  static init(): World {
    return new World({
      env: new Env(),
      mod: new Mod(),
      value_stack: new ValueStack(),
    })
  }

  push(value: Value): World {
    return new World({
      ...this,
      value_stack: this.value_stack.push(value),
    })
  }

  pop(): [Value, World] {
    return [
      this.value_stack.tos(),
      new World({
        ...this,
        value_stack: this.value_stack.drop(),
      }),
    ]
  }

  env_extend(name: string, value: Value): World {
    return new World({
      ...this,
      env: this.env.extend(name, value),
    })
  }

  mod_extend(name: string, triplex: Triplex): World {
    return new World({
      ...this,
      mod: this.mod.extend(name, triplex),
    })
  }
}
