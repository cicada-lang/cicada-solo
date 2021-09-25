import { Exp } from "../exp"
import { Stmt } from "../stmt"
import { Parser } from "../parser"
import pt from "@cicada-lang/partech"

export function stmts(strs: TemplateStringsArray): Array<Stmt> {
  const [text] = strs
  const parser = new Parser()
  return parser.parse_stmts(text)
}

export function exp(strs: TemplateStringsArray): Exp {
  const [text] = strs
  const parser = new Parser()
  return parser.parse_exp(text)
}

export function not_stmts(strs: TemplateStringsArray): void {
  try {
    const [text] = strs
    const parser = new Parser()
    parser.parse_stmts(text)
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
    const parser = new Parser()
    parser.parse_exp(text)
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

export function echo_stmts(strs: TemplateStringsArray): void {
  const [text] = strs
  const parser = new Parser()
  const stmts = parser.parse_stmts(text)
  for (const stmt of stmts) {
    console.log(stmt.repr())
  }
}

export function echo_exp(strs: TemplateStringsArray): void {
  const [text] = strs
  const parser = new Parser()
  const exp = parser.parse_exp(text)
  console.log(exp.repr())
}
