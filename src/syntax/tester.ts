import { Exp } from "../exp"
import { Stmt } from "../stmt"
import { parse_exp } from "./parse-exp"
import { parse_stmts } from "./parse-stmts"
import pt from "@cicada-lang/partech"

export function stmts(strs: TemplateStringsArray): Array<Stmt> {
  const [text] = strs
  return parse_stmts(text)
}

export function exp(strs: TemplateStringsArray): Exp {
  const [text] = strs
  return parse_exp(text)
}

export function not_stmts(strs: TemplateStringsArray): void {
  try {
    const [text] = strs
    parse_stmts(text)
    throw new Error(
      [
        `I (Syntax tester) expect the text to not be stmts, but they are.`,
        `---`,
        `${text}`,
        `---`,
      ].join("\n")
    )
  } catch (error) {
    if (error instanceof pt.ParsingError) {
      return
    } else {
      throw error
    }
  }
}

export function not_exp(strs: TemplateStringsArray): void {
  try {
    const [text] = strs
    parse_exp(text)
    throw new Error(
      [
        `I (Syntax tester) expect the text to not be exp, but it is.`,
        `---`,
        `${text}`,
        `---`,
      ].join("\n")
    )
  } catch (error) {
    if (error instanceof pt.ParsingError) {
      return
    } else {
      throw error
    }
  }
}
