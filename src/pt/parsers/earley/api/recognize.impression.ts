import { recognize } from "./recognize"
import { grammar, lex } from "./recognize.test"
import * as Mod from "../../../mod"
import * as Env from "../../../env"
import * as Exp from "../../../exp"
import * as Token from "../../../token"
import assert from "assert"

function impress(text: string): void {
  console.log(">>>", text)
  assert(recognize(lex(text), grammar, { task: { verbose: true } }))
  console.log()
}

impress("a")
impress("a-a")
impress("a-a+a")
