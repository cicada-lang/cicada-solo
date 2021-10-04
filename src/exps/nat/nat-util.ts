import { Exp, ExpMeta, subst } from "../../exp"
import { Core } from "../../core"
import * as Exps from "../../exps"
import pt from "@cicada-lang/partech"

export function nat_from_number(n: number, meta: ExpMeta): Exp {
  if (n <= 0) {
    return new Exps.Zero(meta)
  } else {
    const almost = nat_from_number(n - 1, meta)
    return new Exps.Add1(almost)
  }
}

export function nat_to_number(exp: Exp | Core): number | undefined {
  if (exp instanceof Exps.ZeroCore || exp instanceof Exps.Zero) {
    return 0
  } else if (exp instanceof Exps.Add1Core || exp instanceof Exps.Add1) {
    const almost = nat_to_number((exp as Exps.Add1Core).prev)
    if (almost !== undefined) {
      return 1 + almost
    } else {
      return undefined
    }
  } else {
    return undefined
  }
}
