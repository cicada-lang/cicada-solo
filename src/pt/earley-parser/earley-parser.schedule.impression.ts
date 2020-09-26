import * as EarleyParser from "../earley-parser"
import { grammar, lex } from "./earley-parser.recognize.test"

const parser = EarleyParser.create(grammar, {
  schedule: {
    verbose: true,
  },
})

function impression(text: string): void {
  console.log(">>>", text)
  parser.recognize(lex(text))
  console.log()
}

impression("a")
impression("a-a")
impression("a-a+a")
