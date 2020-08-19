import * as Exp from "../exp"
import * as Env from "../env"
import * as Value from "../value"

export function nat_ind_step_t(motive: Value.Value): Value.Value {
  const env = Env.extend(Env.init(), "motive", motive)

  const step_t: Exp.pi = {
    kind: "Exp.pi",
    name: "prev",
    arg_t: { kind: "Exp.nat" },
    ret_t: {
      kind: "Exp.pi",
      name: "almost",
      arg_t: {
        kind: "Exp.ap",
        target: { kind: "Exp.v", name: "motive" },
        arg: { kind: "Exp.v", name: "prev" },
      },
      ret_t: {
        kind: "Exp.ap",
        target: { kind: "Exp.v", name: "motive" },
        arg: { kind: "Exp.add1", prev: { kind: "Exp.v", name: "prev" } },
      },
    },
  }

  return Exp.evaluate(env, step_t)
}
