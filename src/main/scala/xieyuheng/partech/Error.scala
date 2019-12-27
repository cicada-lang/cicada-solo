package xieyuheng.partech

case class ErrorDuringParsing(message: String, span: Span) extends Throwable
