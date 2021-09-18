import { Exp, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Solution } from "../../solution"

export abstract class Cls extends Exp {
  instanceofExpsCls = true

  abstract field_names: Array<string>
  abstract fields_repr(): Array<string>
  abstract subst(name: string, exp: Exp): Cls
  abstract infer(ctx: Ctx): { t: Value; core: Core }
}
