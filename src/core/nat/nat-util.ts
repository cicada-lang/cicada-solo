import { Exp } from "../../exp"
import { Value } from "../../value"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { Nat, Zero, Add1 } from "../../core"
import { Var, Pi, Ap } from "../../core"

export function nat_from_number(n: number): Exp {
  if (n <= 0) {
    return new Zero()
  } else {
    const almost = nat_from_number(n - 1)
    return new Add1(almost)
  }
}

export function nat_to_number(exp: Exp): number | undefined {
  if (exp instanceof Zero) {
    return 0
  } else if (exp instanceof Add1) {
    const almost = nat_to_number((exp as Add1).prev)
    if (almost !== undefined) {
      return 1 + almost
    } else {
      return undefined
    }
  } else {
    return undefined
  }
}

export function nat_ind_step_t(motive: Value): Value {
  const env = new Env().extend("motive", motive)

  const step_t = new Pi(
    "prev",
    new Nat(),
    new Pi(
      "almost",
      new Ap(new Var("motive"), new Var("prev")),
      new Ap(new Var("motive"), new Add1(new Var("prev")))
    )
  )

  return evaluate(env, step_t)
}
