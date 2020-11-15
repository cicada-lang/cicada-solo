import * as Exp from "../../exp"
import * as Top from "../../top"
import * as Project from "../../project"
import * as pt from "../../../partech"
import { exp_matcher, sums_matcher, modpath_matcher } from "../matchers"

export function top_matcher(tree: pt.Tree.Tree): Top.Top {
  return pt.Tree.matcher<Top.Top>({
    "top:import": ({ modpath }) =>
      Top.$import(Project.modpath_repr(modpath_matcher(modpath))),
    "top:def": ({ name, exp }) =>
      Top.def(pt.Tree.str(name), undefined, exp_matcher(exp)),
    "top:claim": ({ claim, t, define, exp }, { span }) => {
      if (pt.Tree.str(claim) !== pt.Tree.str(define)) {
        throw new pt.ParsingError(
          "Name mismatch.\n" +
            `- name to claim  : ${pt.Tree.str(claim)}\n` +
            `- name to define : ${pt.Tree.str(define)}\n`,
          { span }
        )
      }
      return Top.def(pt.Tree.str(claim), exp_matcher(t), exp_matcher(exp))
    },
    "top:show": ({ exp }) => Top.show(exp_matcher(exp)),
    "top:datatype": ({ name, t, sums }) =>
      Top.type_constructor(
        Exp.type_constructor(
          pt.Tree.str(name),
          exp_matcher(t),
          sums_matcher(sums)
        )
      ),
  })(tree)
}

export function tops_matcher(tree: pt.Tree.Tree): Array<Top.Top> {
  return pt.Tree.matcher<Array<Top.Top>>({
    "tops:tops": ({ tops }) =>
      pt.matchers.zero_or_more_matcher(tops).map(top_matcher),
  })(tree)
}
