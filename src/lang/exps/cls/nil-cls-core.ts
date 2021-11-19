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

  fields_format(): Array<string> {
    return []
  }

  format(): string {
    return `class {}`
  }

  fields_alpha_format(ctx: AlphaCtx): Array<string> {
    return []
  }

  alpha_format(ctx: AlphaCtx): string {
    return `class {}`
  }
}
