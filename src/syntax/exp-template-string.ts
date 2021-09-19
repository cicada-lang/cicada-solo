import { Exp } from "../exp"
import { parse_exp } from "./parse-exp"

export function exp(strs: TemplateStringsArray): Exp {
  const [text] = strs
  return parse_exp(text)
}
