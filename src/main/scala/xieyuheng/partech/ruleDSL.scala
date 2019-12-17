package xieyuheng.partech

object ruleDSL {

  implicit def RulePartStrFromString(str: String): RulePartStr = {
    RulePartStr(str)
  }

  implicit def RulePartRuleFromRule(rule: => Rule): RulePartRule = {
    RulePartRule(() => rule)
  }

  implicit def RulePartPredFromWordPred(word_pred: WordPred): RulePartPred = {
    RulePartPred(word_pred)
  }

}
