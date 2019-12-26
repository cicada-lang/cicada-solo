package xieyuheng.party

sealed trait Tree
final case class Leaf(token: Token) extends Tree
final case class Node(rule: Rule, choice_name: String, children: List[Tree]) extends Tree
