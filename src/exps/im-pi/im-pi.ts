import { Exp, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { check } from "../../exp"
import { evaluate } from "../../core"
import { Trace } from "../../errors"
import * as Exps from "../../exps"
import * as ut from "../../ut"

export abstract class ImPi extends Exp {
  instanceofImPi = true
}
