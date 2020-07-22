import * as Exp from "../exp"
import * as ut from "../../ut"

export function repr(exp: Exp.Exp): string {
  switch (exp.kind) {
    case "Exp.Var": {
      return exp.name
    }
    case "Exp.Pi": {
      return `(${exp.name}: ${Exp.repr(exp.arg_t)}) -> ${Exp.repr(exp.ret_t)}`
    }
    case "Exp.Fn": {
      return `(${exp.name}) => ${Exp.repr(exp.body)}`
    }
    case "Exp.Ap": {
      return `${Exp.repr(exp.target)}(${Exp.repr(exp.arg)})`
    }
    case "Exp.Sigma": {
      return `(${exp.name}: ${Exp.repr(exp.car_t)}) * ${Exp.repr(exp.cdr_t)}`
    }
    case "Exp.Cons": {
      return `cons(${Exp.repr(exp.car)}, ${Exp.repr(exp.cdr)})`
    }
    case "Exp.Car": {
      return `car(${Exp.repr(exp.target)})`
    }
    case "Exp.Cdr": {
      return `cdr(${Exp.repr(exp.target)})`
    }
    case "Exp.Nat": {
      return "Nat"
    }
    case "Exp.Zero": {
      return "zero"
    }
    case "Exp.Add1": {
      return `add1(${Exp.repr(exp.prev)})`
    }
    case "Exp.NatInd": {
      return `Nat.ind(${Exp.repr(exp.target)}, ${Exp.repr(
        exp.motive
      )}, ${Exp.repr(exp.base)}, ${Exp.repr(exp.step)})`
    }
    case "Exp.Equal": {
      return `Equal(${Exp.repr(exp.t)}, ${Exp.repr(exp.from)}, ${Exp.repr(
        exp.to
      )})`
    }
    case "Exp.Same": {
      return "Same"
    }
    case "Exp.Replace": {
      return `replace(${Exp.repr(exp.target)}, ${Exp.repr(
        exp.motive
      )}, ${Exp.repr(exp.base)})`
    }
    case "Exp.Trivial": {
      return "Trivial"
    }
    case "Exp.Sole": {
      return "sole"
    }
    case "Exp.Absurd": {
      return "Absurd"
    }
    case "Exp.AbsurdInd": {
      return `Absurd.ind(${Exp.repr(exp.target)}, ${Exp.repr(exp.motive)})`
    }
    case "Exp.Str": {
      return "String"
    }
    case "Exp.Quote": {
      return `"${exp.str}"`
    }
    case "Exp.Type": {
      return "Type"
    }
    case "Exp.Suite": {
      const def_reprs = exp.defs.map((def) => `${def.name} = ${repr(def.exp)}`)
      const suite_repr = [...def_reprs, repr(exp.body)].join("\n")
      return `{\n${ut.indent(suite_repr, "  ")}\n}`
    }
    case "Exp.The": {
      return `${Exp.repr(exp.exp)}: ${Exp.repr(exp.t)}`
    }
  }
}
