import { Exp } from "../exp"
import { Add1, Zero } from "../exps"

export function nat_from_number(n: number): Exp {
  if (n <= 0) {
    return Zero
  } else {
    const almost = nat_from_number(n - 1)
    return Add1(almost)
  }
}
