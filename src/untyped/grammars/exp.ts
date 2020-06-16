import * as Exp from "../exp"
import pt from "@forchange/partech"
import rr from "@forchange/readable-regular-expression"

const identifier = pt.Sym.create_par_from_kind("identifier")

function exp(): pt.Sym.Rule {
  return pt.Sym.create_rule("exp", {
    var: [identifier],
    fn: ["(", identifier, ")", "=", ">", exp],
    ap: [exp, "(", exp, ")"],
  })
}

// TODO
// function exp_matcher(tree: pt.Tree.Tree): string {
//   return pt.Tree.matcher("exp", {
//     var: ([name]) => {
//       return {
//         kind:
//       }
//     },
//     fn: ["(", identifier, ")", "=", ">", exp],
//     ap: [exp, "(", exp, ")"],
//   })(tree)
// }
