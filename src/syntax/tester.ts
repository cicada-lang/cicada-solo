import { Exp } from "../exp"
import { Stmt } from "../stmt"
import { parse_exp } from "./parse-exp"
import { parse_stmts } from "./parse-stmts"

export function stmts(strs: TemplateStringsArray): Array<Stmt> {
  const [text] = strs
  return parse_stmts(text)
}

export function exp(strs: TemplateStringsArray): Exp {
  const [text] = strs
  return parse_exp(text)
}
