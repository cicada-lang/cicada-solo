import * as Exp from "../exp"
import { Env } from "../env"
import * as Value from "../value"
import * as Evaluate from "../evaluate"
import { Var, Pi, Ap, Nat, Add1 } from "../exps"

export function nat_ind_step_t(motive: Value.Value): Value.Value {
  const env = Env.init().extend("motive", motive)

  const step_t = Pi(
    "prev",
    new Nat(),
    Pi(
      "almost",
      new Ap(new Var("motive"), new Var("prev")),
      new Ap(new Var("motive"), new Add1(new Var("prev")))
    )
  )

  return Evaluate.evaluate(env, step_t)
}
