import * as EarleyParser from "../earley-parser"
import { grammar, lex } from "./earley-parser.recognize.test"

const parser = EarleyParser.create(grammar, {
  task: {
    verbose: true,
  },
})

function show(text: string): void {
  console.log(">>>", text)
  parser.recognize(lex(text))
  console.log()
}

show("a")
show("a-a")
show("a-a+a")
