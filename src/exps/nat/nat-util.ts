import { Exp } from "../../exp"
import * as Exps from "../../exps"

export function nat_from_number(n: number): Exp {
  if (n <= 0) {
    return new Exps.Zero()
  } else {
    const almost = nat_from_number(n - 1)
    return new Exps.Add1(almost)
  }
}

export function nat_to_number(exp: Exp): number | undefined {
  if (exp instanceof Exps.Zero) {
    return 0
  } else if (exp instanceof Exps.Add1) {
    const almost = nat_to_number((exp as Exps.Add1).prev)
    if (almost !== undefined) {
      return 1 + almost
    } else {
      return undefined
    }
  } else {
    return undefined
  }
}
