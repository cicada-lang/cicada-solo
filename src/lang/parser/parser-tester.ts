import { ParsingError } from "../errors"
import { Exp } from "../exp"
import { Parser } from "../parser"
import { Stmt } from "../stmt"

export class ParserTester {
  parser = new Parser()

  stmts(text: string): Array<Stmt> {
    return this.parser.parseStmts(text)
  }

  exp(text: string): Exp {
    return this.parser.parseExp(text)
  }

  notStmts(text: string): void {
    try {
      this.parser.parseStmts(text)
      throw new Error(
        [
          `I (Syntax tester) expect the text to not be stmts, but they are.`,
          `---`,
          `${text}`,
          `---`,
        ].join("\n")
      )
    } catch (error) {
      if (error instanceof ParsingError) return
      else throw error
    }
  }

  notExp(text: string): void {
    try {
      this.parser.parseExp(text)
      throw new Error(
        [
          `I (Syntax tester) expect the text to not be exp, but it is.`,
          `---`,
          `${text}`,
          `---`,
        ].join("\n")
      )
    } catch (error) {
      if (error instanceof ParsingError) return
      else throw error
    }
  }

  echoStmts(text: string): void {
    const stmts = this.parser.parseStmts(text)
    for (const stmt of stmts) {
      console.log(stmt.format())
    }
  }

  echoExp(text: string): void {
    const exp = this.parser.parseExp(text)
    console.log(exp.format())
  }
}
