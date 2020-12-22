import * as Exp from "../exp"
import { Zero, Add1 } from "../exps"

export function nat_from_number(n: number): Exp.Exp {
  if (n <= 0) {
    return Zero
  } else {
    const almost = nat_from_number(n - 1)
    return Add1(almost)
  }
}
