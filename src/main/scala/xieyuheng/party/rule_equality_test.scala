package xieyuheng.party

import predefined._

object rule_equality_test extends App {

  def exp1(): Rule = Rule("exp1", Map(
    "fn" -> List(),
    "ap" -> List(SymbolFn(exp1)),
  ))

  def exp2(): Rule = Rule("exp2", Map(
    "fn" -> List(),
    "ap" -> List(SymbolFn(exp2)),
  ))

  assert(exp1() == exp1())
  assert(exp1() != exp2())

  assert(SymbolAp(non_empty_list, List(SymbolRule(exp1))) == SymbolAp(non_empty_list, List(SymbolRule(exp1))))
  assert(SymbolAp(non_empty_list, List(SymbolRule(exp1))) != SymbolAp(non_empty_list, List(SymbolRule(exp2))))

}
