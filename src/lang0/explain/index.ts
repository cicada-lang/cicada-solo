import * as Evaluate from "../evaluate"
import * as ut from "../../ut"
import * as Env from "../env"

export function explain_name_undefined(name: string): string {
  const explanation = `
    |The name ${name} is undefined.
    |`
  return ut.aline(explanation)
}
