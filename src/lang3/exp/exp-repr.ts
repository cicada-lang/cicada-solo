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
      if (exp.sat.length === 0 && exp.scope.length === 0) return "Object"

      const parts = [
        ...exp.sat.map(
          ({ name, t, exp }) => `${name} : ${Exp.repr(t)} = ${Exp.repr(exp)}`
        ),
        ...exp.scope.map(({ name, t }) => `${name} : ${Exp.repr(t)}`),
      ]
      let s = parts.join("\n")
      return `{\n${ut.indent(s, "  ")}\n}`
    }
    case "Exp.obj": {
      const s = Array.from(exp.properties)
        .map(([name, exp]) => `${name} = ${Exp.repr(exp)}`)
        .join("\n")
      return `{\n${ut.indent(s, "  ")}\n}`
    }
    case "Exp.dot": {
      const { target, name } = exp
      return `${Exp.repr(target)}.${name}`
    }
    case "Exp.equal": {
      return `Equal(${Exp.repr(exp.t)}, ${Exp.repr(exp.from)}, ${Exp.repr(
        exp.to
      )})`
    }
    case "Exp.same": {
      return "same"
    }
    case "Exp.replace": {
      return `replace(${Exp.repr(exp.target)}, ${Exp.repr(
        exp.motive
      )}, ${Exp.repr(exp.base)})`
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
      const s = [...exp.stmts.map(Stmt.repr), repr(exp.ret)].join("\n")
      return `{\n${ut.indent(s, "  ")}\n}`
    }
    case "Exp.the": {
      return exp.repr()
    }
  }
}
