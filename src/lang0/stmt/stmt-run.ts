import * as Stmt from "../stmt"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Env from "../env"

export function run(env: Env.Env, stmt: Stmt.Stmt): void {
  Stmt.execute(env, stmt)

  switch (stmt.kind) {
    case "Stmt.show": {
      const { exp } = stmt
      const value = Exp.evaluate(env, exp)
      const norm = Value.readback(new Set(env.keys()), value)
      console.log(Exp.repr(norm))
    }
  }
}
