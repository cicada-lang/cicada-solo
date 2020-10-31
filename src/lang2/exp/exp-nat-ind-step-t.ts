import * as Exp from "../exp"
import * as Env from "../env"
import * as Value from "../value"
import * as Evaluate from "../evaluate"

export function nat_ind_step_t(motive: Value.Value): Value.Value {
  const env = Env.update(Env.init(), "motive", motive)

  const step_t = Exp.pi(
    "prev",
    Exp.nat,
    Exp.pi(
      "almost",
      Exp.ap(Exp.v("motive"), Exp.v("prev")),
      Exp.ap(Exp.v("motive"), Exp.add1(Exp.v("prev")))
    )
  )

  return Evaluate.evaluate(env, step_t)
}
