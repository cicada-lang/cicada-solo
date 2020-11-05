import * as Evaluate from "../evaluate"
import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Pattern from "../pattern"
import * as ut from "../../ut"

export function repr(exp: Exp.Exp): string {
  switch (exp.kind) {
    case "Exp.v": {
      return exp.name
    }
    case "Exp.pi": {
      return `(${exp.name}: ${Exp.repr(exp.arg_t)}) -> ${Exp.repr(exp.ret_t)}`
    }
    case "Exp.fn": {
      return `(${Pattern.repr(exp.pattern)}) => ${Exp.repr(exp.ret)}`
    }
    case "Exp.case_fn": {
      let s = exp.cases
        .map(
          ({ pattern, ret }) => `(${Pattern.repr(pattern)}) => ${Exp.repr(ret)}`
        )
        .join("\n")
      return `{\n${ut.indent(s, "  ")}\n}`
    }
    case "Exp.ap": {
      return `${Exp.repr(exp.target)}(${Exp.repr(exp.arg)})`
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
      return "Absurd"
    }
    case "Exp.absurd_ind": {
      return `Absurd.ind(${Exp.repr(exp.target)}, ${Exp.repr(exp.motive)})`
    }
    case "Exp.str": {
      return "String"
    }
    case "Exp.quote": {
      return `"${exp.str}"`
    }
    case "Exp.union": {
      const { left, right } = exp
      return `{ ${Exp.repr(left)} | ${Exp.repr(right)} }`
    }
    case "Exp.type_constructor": {
      // const s = exp.sums
      //   .map((sum) => `${sum.tag} : ${Exp.repr(sum.t)}`)
      //   .join("\n")
      // return `@datatype ${exp.name} : ${Exp.repr(exp.t)} {\n${ut.indent(
      //   s,
      //   "  "
      // )}\n}`
      return exp.name
    }
    case "Exp.type": {
      return "Type"
    }
    case "Exp.begin": {
      const s = [...exp.stmts.map(Stmt.repr), repr(exp.ret)].join("\n")
      return `{\n${ut.indent(s, "  ")}\n}`
    }
    case "Exp.the": {
      return `{ ${Exp.repr(exp.t)} -- ${Exp.repr(exp.exp)} }`
    }
  }
}
