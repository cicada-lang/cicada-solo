import * as Value from "../value"
import * as Exp from "../exp"
import * as Env from "../env"
import * as ut from "../../ut"
import fs from "fs"

export function run(file: string, opts: any): void {
  const text = fs.readFileSync(file, { encoding: "utf-8" })
  const exp = Exp.parse(text)
  const env = Env.init()
  const value = Exp.evaluate(env, exp)
  const norm = Value.readback(new Set(), value)
  console.log(Exp.repr(norm))
}
