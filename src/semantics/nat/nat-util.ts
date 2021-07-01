import { Exp } from "../../exp"
import { Core } from "../../core"
import * as Exps from "../../exps"
import * as Cores from "../../cores"

export function nat_from_number(n: number): Exp {
  if (n <= 0) {
    return new Exps.Zero()
  } else {
    const almost = nat_from_number(n - 1)
    return new Exps.Add1(almost)
  }
}

export function nat_to_number(exp: Exp | Core): number | undefined {
  if (exp instanceof Cores.Zero || exp instanceof Exps.Zero) {
    return 0
  } else if (exp instanceof Cores.Add1 || exp instanceof Exps.Add1) {
    const almost = nat_to_number((exp as Cores.Add1).prev)
    if (almost !== undefined) {
      return 1 + almost
    } else {
      return undefined
    }
  } else {
    return undefined
  }
}
