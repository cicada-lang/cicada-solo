import { Core, AlphaCtx } from "../../core"
import { Value } from "../../value"
import { Env } from "../../env"
import * as Cores from "../../cores"
import * as ut from "../../ut"

export abstract class Cls2 extends Core {
  instanceofCoresCls2 = true
}

export class ClsNil extends Cls2 {
  evaluate(env: Env): Value {
    throw new Error()
    // return new Cores.ClsNilValue()
  }

  repr(): string {
    return `class {}`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `class {}`
  }
}

export class ClsCons extends Cls2 {
  evaluate(env: Env): Value {
    throw new Error()
  }

  repr(): string {
    throw new Error()
  }

  alpha_repr(ctx: AlphaCtx): string {
    throw new Error()
  }
}
