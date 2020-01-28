import { ErrorDuringParsing } from "@forchange/partech/lib/error"
import { Earley } from "@forchange/partech/lib/earley"
import { Parser } from "@forchange/partech/lib/parser"
import * as ptc from "@forchange/partech/lib/predefined"

import * as Top from "./top"
import * as CMD from "./cmd"
import * as API from "./api"
import * as grammar from "./grammar"

const pkg: any = require("../package.json")

export class CicadaCommandLine extends CMD.CommandLine {
  name(): string {
    return pkg.name
  }

  version(): string {
    return pkg.version
  }

  run_code(code: string): void {
    const lexer = ptc.common_lexer
    const partech = new Earley()
    const parser = new Parser(lexer, partech, grammar.top_list())

    try {
      let tree = parser.parse(code)
      let top_list: Array<Top.Top> = grammar.top_list_matcher(tree)
      API.run(top_list)
    }

    catch (error) {
      if (error instanceof ErrorDuringParsing) {
        console.log(`parsing error, at ${error.span.repr()}`)
        error.span.report_in_context(code)
        console.log(`${error.message}`)
      }

      else {
        throw error
      }
    }
  }
}
