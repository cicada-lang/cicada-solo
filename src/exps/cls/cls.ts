import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { check } from "../../exp"
import { evaluate } from "../../core"
import { Value } from "../../value"
import { Trace } from "../../errors"
import * as Exps from "../../exps"
import * as ut from "../../ut"

export abstract class Cls extends Exp {
  instanceofExpsCls = true

  abstract fields_repr(): Array<string>
  abstract subst(name: string, exp: Exp): Cls
  abstract infer(ctx: Ctx): { t: Value; core: Core }
}
