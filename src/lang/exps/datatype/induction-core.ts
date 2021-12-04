import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { evaluate } from "../../core"
import * as Exps from "../../exps"
import * as ut from "../../../ut"

export class InductionCore extends Core {
  constructor() {
    super()
  }

  evaluate(env: Env): Value {
    throw new Error("TODO")
  }

  format(): string {
    throw new Error("TODO")
  }

  alpha_format(ctx: AlphaCtx): string {
    throw new Error("TODO")
  }
}
