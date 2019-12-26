package xieyuheng.party

case class ErrorDuringParsing(message: String, span: Span) extends Throwable
