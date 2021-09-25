import { Exp } from "../exp"
import { Stmt } from "../stmt"
import { Parser } from "../parser"
import pt from "@cicada-lang/partech"

export class ParserTester {
  parser = new Parser()

  stmts(strs: TemplateStringsArray): Array<Stmt> {
    const [text] = strs
    return this.parser.parse_stmts(text)
  }

  exp(strs: TemplateStringsArray): Exp {
    const [text] = strs
    return this.parser.parse_exp(text)
  }

  not_stmts(strs: TemplateStringsArray): void {
    try {
      const [text] = strs
      this.parser.parse_stmts(text)
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

  not_exp(strs: TemplateStringsArray): void {
    try {
      const [text] = strs
      this.parser.parse_exp(text)
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

  echo_stmts(strs: TemplateStringsArray): void {
    const [text] = strs
    const stmts = this.parser.parse_stmts(text)
    for (const stmt of stmts) {
      console.log(stmt.repr())
    }
  }

  echo_exp(strs: TemplateStringsArray): void {
    const [text] = strs
    const exp = this.parser.parse_exp(text)
    console.log(exp.repr())
  }
}
