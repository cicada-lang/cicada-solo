package xieyuheng.partech

import predefined._

object rule_equality_test extends App {

  val exp1: () => Rule = () => Rule("exp1", Map(
    "fn" -> List(),
    "ap" -> List(SymbolFn(exp1)),
  ))

  val exp2: () => Rule = () => Rule("exp2", Map(
    "fn" -> List(),
    "ap" -> List(SymbolFn(exp2)),
  ))

  assert(exp1() == exp1())
  assert(exp1() != exp2())

  assert(exp1 == exp1)
  assert(exp1 != exp2)

  val list = List(exp1, exp1)

  assert(list(0) == list(1))

  assert(SymbolAp(non_empty_list, List(SymbolRule(exp1())))
    ==   SymbolAp(non_empty_list, List(SymbolRule(exp1()))))
  assert(SymbolAp(non_empty_list, List(SymbolRule(exp1())))
    !=   SymbolAp(non_empty_list, List(SymbolRule(exp2()))))

  assert(SymbolAp(non_empty_list, List(SymbolFn(exp1)))
    ==   SymbolAp(non_empty_list, List(SymbolFn(exp1))))

  assert(SymbolAp(non_empty_list, List(SymbolFn(exp1)))
    !=   SymbolAp(non_empty_list, List(SymbolFn(exp2))))

  val ap = SymbolAp(non_empty_list, List(SymbolFn(exp2)))
  assert(ap.non_terminal_to_rule() == ap.non_terminal_to_rule())

}
