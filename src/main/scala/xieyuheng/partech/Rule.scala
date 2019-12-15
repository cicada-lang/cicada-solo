package xieyuheng.partech

case class Rule(
  name: String,
  choices: Map[String, List[RulePart]],
  args: Map[String, Rule] = Map(),
) {

  if (choices.size == 0) {
    println("Rule should not have empty choices")
    println(s"name: ${name}")
    throw new Exception()
  }

  choices.foreach { case (choice_name, rule_parts) =>
    if (rule_parts.length == 0) {
      println("Rule's choice should not have empty List")
      println(s"name: ${name}")
      println(s"choice: ${choice_name}")
      throw new Exception()
    }
  }

  // IMPORTANT BUG
  // - we can not use `==`
  //   because we can not compare lambda (rule_gen)
  // - equivalent relation between circular data is problematic
  //   and equivalent is important in for the correctness of the parser
  // - even with the following `metters`
  //   we can not ensure the parser is right

  val choices_matter: Set[(String, Int)] = {
    choices.map { case (choice_name, list) =>
      (choice_name, list.length)
    }.toSet
  }

  val choices_matter2: Set[String] = {
    choices.keys.toSet
  }

  val choices_matter3: Map[String, List[RulePart]] = {
    choices.map { case (choice_name, list) =>
      (choice_name, list.filter(_.isInstanceOf[RulePartStr]))
    }
  }

  val matters = (name, choices_matter3, args)

  override def equals(that: Any): Boolean = {
    that match {
      case that: Rule => this.matters == that.matters
      case _ => false
    }
  }

  override def hashCode = matters.hashCode

}

sealed trait RulePart

final case class RulePartStr(str: String) extends RulePart {
  override def toString = {
    val doublequote = '"'
    s"${doublequote}${str}${doublequote}"
  }
}

final case class RulePartRule(rule_gen: () => Rule) extends RulePart {
  override def toString = {
    rule_gen().name
  }
}

final case class RulePartPred(word_pred: WordPred) extends RulePart
