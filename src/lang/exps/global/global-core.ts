import { AlphaCtx, Core } from "../../core"
import { Env } from "../../env"
import { ElaborationError } from "../../errors"
import * as Exps from "../../exps"
import { Value } from "../../value"

export class GlobalCore extends Core {
  name: string

  constructor(name: string) {
    super()
    this.name = name
  }

  free_names(bound_names: Set<string>): Set<string> {
    if (bound_names.has(this.name)) {
      return new Set()
    } else {
      return new Set([this.name])
    }
  }

  evaluate(env: Env): Value {
    const value = Exps.globals.findValue(this.name)
    if (value === undefined) {
      throw new ElaborationError(`I meet undefined global name: ${this.name}`)
    }

    return value
  }

  format(): string {
    return this.name
  }

  alpha_format(ctx: AlphaCtx): string {
    return `#global ${this.name}`
  }
}
