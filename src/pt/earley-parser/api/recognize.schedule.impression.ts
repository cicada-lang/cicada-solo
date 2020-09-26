import { recognize } from "./recognize"
import { grammar, lex } from "./recognize.test"

function impression(text: string): void {
  console.log(">>>", text)
  recognize(lex(text), grammar, {
    schedule: {
      verbose: true,
    },
  })
  console.log()
}

impression("a")
impression("a-a")
impression("a-a+a")
