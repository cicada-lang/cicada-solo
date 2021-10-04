import { Exp, ExpMeta } from "../../exp"
import { Core } from "../../core"
import * as Exps from "../../exps"

export function nat_from_number(n: number, meta: ExpMeta): Exp {
  let result: Exp = new Exps.Zero(meta)

  while (n > 0) {
    result = new Exps.Add1(result, meta)
    n--
  }

  return result
}

export function nat_to_number(exp: Exp | Core): number | undefined {
  let result = 0

  while (true) {
    if (exp instanceof Exps.ZeroCore || exp instanceof Exps.Zero) {
      return result
    } else if (exp instanceof Exps.Add1Core || exp instanceof Exps.Add1) {
      exp = exp.prev
      result++
    } else {
      return undefined
    }
  }
}
