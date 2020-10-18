import * as Pattern from "../pattern"
import * as Exp from "../exp"

export function to_exp(pattern: Pattern.Pattern): Exp.Exp {
  switch (pattern.kind) {
    case "Pattern.v": {
      return Exp.v(pattern.name)
    }
    case "Pattern.datatype": {
      let exp: Exp.Exp = Exp.v(pattern.name)
      for (const arg of pattern.args) {
        exp = Exp.ap(exp, Pattern.to_exp(arg))
      }
      return exp
    }
    case "Pattern.data": {
      let exp: Exp.Exp = Exp.dot(Exp.v(pattern.name), pattern.tag)
      for (const arg of pattern.args) {
        exp = Exp.ap(exp, Pattern.to_exp(arg))
      }
      return exp
    }
  }
}
