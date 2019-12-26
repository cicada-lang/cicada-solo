package xieyuheng.party

object predefined {

  val non_empty_list: List[Symbol] => Rule = {
    case args =>
      Rule("non_empty_list", Map(
        "one" -> List(args(0)),
        "more" -> List(args(0), SymbolAp(non_empty_list, args)),
      ))
  }

}
