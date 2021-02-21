import * as Exp from "../exp"
import { Zero, Add1 } from "../exps"

export function nat_from_number(n: number): Exp.Exp {
  if (n <= 0) {
    return new Zero()
  } else {
    const almost = nat_from_number(n - 1)
    return new Add1(almost)
  }
}
