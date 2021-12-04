import { Exp, ExpMeta, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Solution } from "../../solution"

// NOTE We use null object pattern for `Cls`'s subclasses.

export abstract class Cls extends Exp {
  abstract meta: ExpMeta
  abstract field_names: Array<string>
  abstract fields_format(): Array<string>
  abstract subst(name: string, exp: Exp): Cls
  abstract infer(ctx: Ctx): { t: Value; core: Core }
}
