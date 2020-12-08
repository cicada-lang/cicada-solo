import * as Pattern from "../pattern"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Env from "../env"
import * as Mod from "../mod"
import * as Evaluate from "../evaluate"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function to_value(
  mod: Mod.Mod,
  env: Env.Env,
  pattern: Pattern.Pattern,
  t: Value.Value
): Value.Value {
  switch (pattern.kind) {
    case "Pattern.v": {
      return Value.not_yet(t, Neutral.v(pattern.name))
    }
    case "Pattern.datatype": {
      let oprand = Evaluate.evaluate(mod, env, Exp.v(pattern.name))
      for (const arg of pattern.args) {
        if (
          (oprand.kind === "Value.typecons" ||
            oprand.kind === "Value.datatype") &&
          oprand.t.kind === "Value.pi"
        ) {
          const pi = oprand.t
          oprand = Evaluate.do_ap(
            oprand,
            Pattern.to_value(mod, env, arg, pi.arg_t)
          )
        } else {
          throw new Trace.Trace(
            "expecting oprand.kind to be Value.typecons or Value.datatype\n" +
              `- oprand.kind: ${oprand.kind}\n`
          )
        }
      }
      return oprand
    }
    case "Pattern.data": {
      let oprand = Evaluate.evaluate(
        mod,
        env,
        Exp.dot(Exp.v(pattern.name), pattern.tag)
      )
      for (const arg of pattern.args) {
        if (
          (oprand.kind === "Value.data_constructor" ||
            oprand.kind === "Value.data") &&
          oprand.t.kind === "Value.pi"
        ) {
          const pi = oprand.t
          oprand = Evaluate.do_ap(
            oprand,
            Pattern.to_value(mod, env, arg, pi.arg_t)
          )
        } else {
          throw new Trace.Trace(
            "expecting oprand.kind to be Value.data_constructor or Value.data\n" +
              `- oprand.kind: ${oprand.kind}\n`
          )
        }
      }
      return oprand
    }
  }
}
