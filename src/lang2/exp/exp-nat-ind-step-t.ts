import * as Exp from "../exp"
import * as Env from "../env"
import * as Value from "../value"
import * as Evaluate from "../evaluate"
import { Var, Pi, Ap } from "../exps"

export function nat_ind_step_t(motive: Value.Value): Value.Value {
  const env = Env.update(Env.init(), "motive", motive)

  const step_t = Pi(
    "prev",
    Exp.nat,
    Pi(
      "almost",
      Ap(Var("motive"), Var("prev")),
      Ap(Var("motive"), Exp.add1(Var("prev")))
    )
  )

  return Evaluate.evaluate(env, step_t)
}
