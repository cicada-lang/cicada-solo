import * as Exp from "../exp"

export function repr(exp: Exp.Exp): string {
  switch (exp.kind) {
    case "Exp.v": {
      return exp.repr()
    }
    case "Exp.fn": {
      return exp.repr()
    }
    case "Exp.ap": {
      return exp.repr()
    }
    case "Exp.begin": {
      return exp.repr()
    }
  }
}
