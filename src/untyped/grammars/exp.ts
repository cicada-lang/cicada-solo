import * as Exp from "../exp"
// import pt from "@forchange/partech"
// import rr from "@forchange/readable-regular-expression"

// const identifier = pt.Sym.create_par_from_kind("identifier")

// export function exp(): pt.Sym.Rule {
//   return pt.Sym.create_rule("exp", {
//     var: [identifier],
//     fn: ["(", identifier, ")", "=", ">", exp],
//     ap: [exp, "(", exp, ")"],
//   })
// }

// export function exp_matcher(tree: pt.Tree.Tree): Exp.Exp {
//   return pt.Tree.matcher<Exp.Exp>("exp", {
//     var: ([name]) => {
//       return {
//         kind: Exp.Kind.Var,
//         name: pt.Tree.token(name).value,
//       }
//     },
//     fn: ([, name, , , , body]) => {
//       return {
//         kind: Exp.Kind.Fn,
//         name: pt.Tree.token(name).value,
//         body: exp_matcher(body),
//       }
//     },
//     ap: ([rator, , rand]) => {
//       return {
//         kind: Exp.Kind.Ap,
//         rator: exp_matcher(rator),
//         rand: exp_matcher(rand),
//       }
//     },
//   })(tree)
// }
