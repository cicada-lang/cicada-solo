import * as Exp from "../exp"
import * as Env from "../env"
import * as Value from "../value"

export function nat_ind_step_t(motive: Value.Value): Value.Value {
  const env = Env.extend(Env.init(), "motive", motive)

  const step_t: Exp.Pi = {
    kind: "Exp.Pi",
    name: "prev",
    arg_t: { kind: "Exp.Nat" },
    ret_t: {
      kind: "Exp.Pi",
      name: "almost",
      arg_t: {
        kind: "Exp.Ap",
        target: { kind: "Exp.Var", name: "motive" },
        arg: { kind: "Exp.Var", name: "prev" },
      },
      ret_t: {
        kind: "Exp.Ap",
        target: { kind: "Exp.Var", name: "motive" },
        arg: { kind: "Exp.Add1", prev: { kind: "Exp.Var", name: "prev" } },
      },
    },
  }

  return Exp.evaluate(env, step_t)
}
