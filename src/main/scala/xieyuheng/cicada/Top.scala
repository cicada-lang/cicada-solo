package xieyuheng.cicada

sealed trait Top
final case class TopLet(name: String, exp: Exp) extends Top
final case class TopDefine(name: String, t: Exp, exp: Exp) extends Top
final case class TopKeywordRefuse(exp: Exp, t: Exp) extends Top
final case class TopKeywordAccept(exp: Exp, t: Exp) extends Top
final case class TopKeywordShow(exp: Exp) extends Top
final case class TopKeywordEq(rhs: Exp, lhs: Exp) extends Top
