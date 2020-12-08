import * as Evaluate from "../evaluate"
import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Pattern from "../pattern"
import * as ut from "../../ut"

export function repr(exp: Exp.Exp): string {
  switch (exp.kind) {
    case "Exp.v": {
      return exp.repr()
    }
    case "Exp.pi": {
      return exp.repr()
    }
    case "Exp.fn": {
      return exp.repr()
    }
    case "Exp.case_fn": {
      return exp.repr()
    }
    case "Exp.ap": {
      return exp.repr()
    }
    case "Exp.cls": {
      return exp.repr()
    }
    case "Exp.obj": {
      return exp.repr()
    }
    case "Exp.dot": {
      return exp.repr()
    }
    case "Exp.equal": {
      return exp.repr()
    }
    case "Exp.same": {
      return exp.repr()
    }
    case "Exp.replace": {
      return exp.repr()
    }
    case "Exp.absurd": {
      return exp.repr()
    }
    case "Exp.absurd_ind": {
      return exp.repr()
    }
    case "Exp.str": {
      return exp.repr()
    }
    case "Exp.quote": {
      return exp.repr()
    }
    case "Exp.union": {
      return exp.repr()
    }
    case "Exp.typecons": {
      return exp.repr()
    }
    case "Exp.type": {
      return exp.repr()
    }
    case "Exp.begin": {
      return exp.repr()
    }
    case "Exp.the": {
      return exp.repr()
    }
  }
}
