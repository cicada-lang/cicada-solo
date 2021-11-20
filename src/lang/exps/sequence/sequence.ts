import { Exp, ExpMeta, ElaborationOptions, subst } from "../../exp"
import { Core } from "../../core"
import { Value } from "../../value"
import { Ctx } from "../../ctx"
import { evaluate } from "../../core"
import { infer } from "../../exp"
import { check } from "../../exp"
import * as Exps from "../../exps"
import * as ut from "../../../ut"

export class Sequence extends Exp {
  free_names(bound_names: Set<string>): Set<string> {
    throw new Error("TODO")
  }

  subst(name: string, exp: Exp): Sequence {
    throw new Error("TODO")
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    throw new Error("TODO")
  }

  check(ctx: Ctx, t: Value): Core {
    throw new Error("TODO")
  }

  format(): string {
    throw new Error("TODO")
  }
}
