import * as Exp from "../exp"

export function alpha_equivalent(x: Exp.Exp, y: Exp.Exp): boolean {
  return alpha({
    depth: 0,
    left_names: new Map(),
    left: x,
    right_names: new Map(),
    right: y,
  })
}

function alpha(the: {
  depth: number
  left_names: Map<string, number>
  left: Exp.Exp
  right_names: Map<string, number>
  right: Exp.Exp
}): boolean {
  const { depth, left_names, left, right_names, right } = the
  throw new Error("TODO")
  // if (left.kind === "Exp.v" && right.kind === "Exp.v") {
  //   const left_depth = left_names.get(left.name)
  //   const right_depth = right_names.get(right.name)
  //   return (
  //     (left_depth === undefined &&
  //       right_depth === undefined &&
  //       left.name === right.name) ||
  //     (typeof left_depth === "number" &&
  //       typeof right_depth === "number" &&
  //       left_depth === right_depth)
  //   )
  // } else if (left.kind === "Exp.pi" && right.kind === "Exp.pi") {
  //   return (
  //     alpha({ ...the, left: left.arg_t, right: right.arg_t }) &&
  //     alpha({
  //       depth: depth + 1,
  //       left_names: left_names.set(left.name, depth),
  //       left: left.ret_t,
  //       right_names: right_names.set(right.name, depth),
  //       right: right.ret_t,
  //     })
  //   )
  // } else if (left.kind === "Exp.fn" && right.kind === "Exp.fn") {
  //   return alpha({
  //     depth: depth + 1,
  //     left_names: left_names.set(left.name, depth),
  //     left: left.ret,
  //     right_names: right_names.set(right.name, depth),
  //     right: right.ret,
  //   })
  // } else if (left.kind === "Exp.ap" && right.kind === "Exp.ap") {
  //   return (
  //     alpha({ ...the, left: left.target, right: right.target }) &&
  //     alpha({ ...the, left: left.arg, right: right.arg })
  //   )
  // } else if (left.kind === "Exp.sigma" && right.kind === "Exp.sigma") {
  //   return (
  //     alpha({ ...the, left: left.car_t, right: right.car_t }) &&
  //     alpha({
  //       depth: depth + 1,
  //       left_names: left_names.set(left.name, depth),
  //       left: left.cdr_t,
  //       right_names: right_names.set(right.name, depth),
  //       right: right.cdr_t,
  //     })
  //   )
  // } else if (left.kind === "Exp.cons" && right.kind === "Exp.cons") {
  //   return (
  //     alpha({ ...the, left: left.car, right: right.car }) &&
  //     alpha({ ...the, left: left.cdr, right: right.cdr })
  //   )
  // } else if (left.kind === "Exp.car" && right.kind === "Exp.car") {
  //   return alpha({ ...the, left: left.target, right: right.target })
  // } else if (left.kind === "Exp.cdr" && right.kind === "Exp.cdr") {
  //   return alpha({ ...the, left: left.target, right: right.target })
  // } else if (left.kind === "Exp.nat" && right.kind === "Exp.nat") {
  //   return true
  // } else if (left.kind === "Exp.zero" && right.kind === "Exp.zero") {
  //   return true
  // } else if (left.kind === "Exp.add1" && right.kind === "Exp.add1") {
  //   return alpha({ ...the, left: left.prev, right: right.prev })
  // } else if (left.kind === "Exp.nat_ind" && right.kind === "Exp.nat_ind") {
  //   return (
  //     alpha({ ...the, left: left.target, right: right.target }) &&
  //     alpha({ ...the, left: left.motive, right: right.motive }) &&
  //     alpha({ ...the, left: left.base, right: right.base }) &&
  //     alpha({ ...the, left: left.step, right: right.step })
  //   )
  // } else if (left.kind === "Exp.equal" && right.kind === "Exp.equal") {
  //   return (
  //     alpha({ ...the, left: left.t, right: right.t }) &&
  //     alpha({ ...the, left: left.from, right: right.from }) &&
  //     alpha({ ...the, left: left.to, right: right.to })
  //   )
  // } else if (left.kind === "Exp.same" && right.kind === "Exp.same") {
  //   return true
  // } else if (left.kind === "Exp.replace" && right.kind === "Exp.replace") {
  //   return (
  //     alpha({ ...the, left: left.target, right: right.target }) &&
  //     alpha({ ...the, left: left.motive, right: right.motive }) &&
  //     alpha({ ...the, left: left.base, right: right.base })
  //   )
  // } else if (left.kind === "Exp.trivial" && right.kind === "Exp.trivial") {
  //   return true
  // } else if (left.kind === "Exp.sole" && right.kind === "Exp.sole") {
  //   return true
  // } else if (left.kind === "Exp.absurd" && right.kind === "Exp.absurd") {
  //   return true
  // } else if (
  //   left.kind === "Exp.absurd_ind" &&
  //   right.kind === "Exp.absurd_ind"
  // ) {
  //   return (
  //     alpha({ ...the, left: left.target, right: right.target }) &&
  //     alpha({ ...the, left: left.motive, right: right.motive })
  //   )
  // } else if (left.kind === "Exp.str" && right.kind === "Exp.str") {
  //   return true
  // } else if (left.kind === "Exp.quote" && right.kind === "Exp.quote") {
  //   return left.str === right.str
  // } else if (left.kind === "Exp.type" && right.kind === "Exp.type") {
  //   return true
  // } else if (
  //   left.kind === "Exp.the" &&
  //   left.t.kind === "Exp.absurd" &&
  //   right.kind === "Exp.the" &&
  //   right.t.kind === "Exp.absurd"
  // ) {
  //   return true
  // } else if (left.kind === "Exp.the" && right.kind === "Exp.the") {
  //   return (
  //     alpha({ ...the, left: left.t, right: right.t }) &&
  //     alpha({ ...the, left: left.exp, right: right.exp })
  //   )
  // } else {
  //   return false
  // }
}
