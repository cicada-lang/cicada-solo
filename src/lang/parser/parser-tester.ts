import { Exp } from "../exp"
import { Stmt } from "../stmt"
import * as Stmts from "../stmts"
import { Parser } from "../parser"
import pt from "@cicada-lang/partech"

export class ParserTester {
  parser = new Parser()

  stmts(text: string): Array<Stmt> {
    return this.parser.parse_stmts(text)
  }

  exp(text: string): Exp {
    return this.parser.parse_exp(text)
  }

  not_stmts(text: string): void {
    try {
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

  not_exp(text: string): void {
    try {
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

  echo_stmts(text: string): void {
    const stmts = this.parser.parse_stmts(text)
    for (const stmt of stmts) {
      console.log(stmt.format())
    }
  }

  echo_exp(text: string): void {
    const exp = this.parser.parse_exp(text)
    console.log(exp.format())
  }
}
