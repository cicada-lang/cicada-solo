package xieyuheng.partech

import xieyuheng.util.pretty._

object pretty {

  def get_args_str(rule: Rule): String = {
    if (rule.args.size == 0) {
      ""
    } else {
      val str = rule.args.map {
        case (name, rule) => s"${name} = ${rule.name}"
      }.mkString(", ")

      s"(${str})"
    }
  }

  def pretty_tree(tree: Tree): String = {
    tree match {
      case Leaf(str) =>
        val doublequote = '"'
        s"${doublequote}${str}${doublequote}"
      case Node(rule, choice_name, children) =>
        val childrenStr = maybe_ln(children.map(pretty_tree).mkString("\n"))
        s"${rule.name}::${choice_name}${get_args_str(rule)} {${childrenStr}}"
    }
  }
}
