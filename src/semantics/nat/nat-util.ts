import { Exp } from "../../exp"
import { Core } from "../../core"
import * as Sem from "../../sem"

export function nat_from_number(n: number): Exp {
  if (n <= 0) {
    return new Sem.Zero()
  } else {
    const almost = nat_from_number(n - 1)
    return new Sem.Add1(almost)
  }
}

export function nat_to_number(exp: Exp | Core): number | undefined {
  if (exp instanceof Sem.ZeroCore || exp instanceof Sem.Zero) {
    return 0
  } else if (exp instanceof Sem.Add1Core || exp instanceof Sem.Add1) {
    const almost = nat_to_number((exp as Sem.Add1Core).prev)
    if (almost !== undefined) {
      return 1 + almost
    } else {
      return undefined
    }
  } else {
    return undefined
  }
}
