import * as Exp from "../exp"
import * as Pattern from "../pattern"
import * as ut from "../../ut"

type AlphaReprOpts = {
  depth: number
  depths: Map<string, number>
}

export function alpha_repr(exp: Exp.Exp, opts: AlphaReprOpts): string {
  switch (exp.kind) {
    case "Exp.v": {
      return exp.alpha_repr(opts)
    }
    case "Exp.pi": {
      return exp.alpha_repr(opts)
    }
    case "Exp.fn": {
      return exp.alpha_repr(opts)
    }
    case "Exp.case_fn": {
      return exp.alpha_repr(opts)
    }
    case "Exp.ap": {
      return exp.alpha_repr(opts)
    }
    case "Exp.cls": {
      return exp.alpha_repr(opts)
    }
    case "Exp.obj": {
      return exp.alpha_repr(opts)
    }
    case "Exp.dot": {
      return exp.alpha_repr(opts)
    }
    case "Exp.equal": {
      return exp.alpha_repr(opts)
    }
    case "Exp.same": {
      return exp.alpha_repr(opts)
    }
    case "Exp.replace": {
      return exp.alpha_repr(opts)
    }
    case "Exp.absurd": {
      return exp.alpha_repr(opts)
    }
    case "Exp.absurd_ind": {
      return exp.alpha_repr(opts)
    }
    case "Exp.str": {
      return exp.alpha_repr(opts)
    }
    case "Exp.quote": {
      return exp.alpha_repr(opts)
    }
    case "Exp.union": {
      return exp.alpha_repr(opts)
    }
    case "Exp.typecons": {
      return exp.alpha_repr(opts)
    }
    case "Exp.type": {
      return exp.alpha_repr(opts)
    }
    case "Exp.begin": {
      return exp.alpha_repr(opts)
    }
    case "Exp.the": {
      return exp.alpha_repr(opts)
    }
  }
}
