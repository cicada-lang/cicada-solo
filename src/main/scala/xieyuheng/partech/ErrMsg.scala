package xieyuheng.partech

case class ErrMsg(tag: String, message: String, span: Span) extends Throwable
