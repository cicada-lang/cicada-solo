import { Stmt } from "../stmt"
import { parse_stmts } from "./parse-stmts"

export function stmts(strs: TemplateStringsArray): Array<Stmt> {
  const [text] = strs
  return parse_stmts(text)
}
