import { AlphaCtx } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"

export class NilClsCore extends Exps.ClsCore {
  append(cls: Exps.ClsCore): Exps.ClsCore {
    return cls
  }

  get field_names(): Array<string> {
    return []
  }

  evaluate(env: Env): Exps.ClsValue {
    return new Exps.NilClsValue()
  }

  fields_repr(): Array<string> {
    return []
  }

  repr(): string {
    return `class {}`
  }

  fields_alpha_repr(ctx: AlphaCtx): Array<string> {
    return []
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `class {}`
  }
}
