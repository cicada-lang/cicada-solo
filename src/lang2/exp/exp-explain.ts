import * as ut from "../../ut"
import * as Env from "../env"

export function explain_env_name_undefined(the: {
  name: string
  env: Env.Env
}): string {
  const explanation = `
    |I see variable ${the.name} during evaluate,
    |but I found that, it is undefined in the environment.
    |`
  return ut.aline(explanation)
}

export function explain_elim_target_mismatch(the: {
  elim: string
  expecting: Array<string>
  reality: string
}): string {
  const explanation = `
    |This is an internal error.
    |When evaluating the eliminator ${the.elim},
    |I am expecting its target to be of the following kind:
    |  ${the.expecting.join(", ")}
    |but in reality, the kind of target I meet is ${the.reality}.
    |`
  return ut.aline(explanation)
}

export function explain_elim_target_type_mismatch(the: {
  elim: string
  expecting: Array<string>
  reality: string
}): string {
  const explanation = `
    |This is an internal error.
    |When evaluating the eliminator ${the.elim},
    |I am expecting its target type to be of the following kind:
    |  ${the.expecting.join(", ")}
    |but in reality, the kind of target type I meet is ${the.reality}.
    |`
  return ut.aline(explanation)
}
