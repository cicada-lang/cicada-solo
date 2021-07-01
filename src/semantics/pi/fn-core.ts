import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Closure } from "../../closure"
import * as Sem from "../../sem"

export class Fn extends Core {
  name: string
  ret: Core

  constructor(name: string, ret: Core) {
    super()
    this.name = name
    this.ret = ret
  }

  evaluate(env: Env): Value {
    return new Sem.FnValue(new Closure(env, this.name, this.ret))
  }

  private multi_fn(names: Array<string> = new Array()): {
    names: Array<string>
    ret: Core
  } {
    if (this.ret instanceof Fn) {
      return this.ret.multi_fn([...names, this.name])
    } else {
      return { names: [...names, this.name], ret: this.ret }
    }
  }

  repr(): string {
    const { names, ret } = this.multi_fn()
    return `(${names.join(", ")}) { ${ret.repr()} }`
  }

  alpha_repr(ctx: AlphaCtx): string {
    const ret_repr = this.ret.alpha_repr(ctx.extend(this.name))
    return `# { ${ret_repr} }`
  }
}
