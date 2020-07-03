import * as ut from "../../ut"
import * as Env from "../env"

export function explain_env_name_undefined(the: {
  name: string
  env: Env.Env
}): string {
  const explanation = `
    |I see variable ${the.name},
    |but I found that, it is undefined in the environment.
    |`
  return ut.aline(explanation)
}
