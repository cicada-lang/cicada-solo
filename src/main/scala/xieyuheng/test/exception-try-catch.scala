package xieyuheng.test

object exception_try_catch extends App {

  case class ErrorDuringTesting(msg: String) extends Throwable

  try {
    throw new ErrorDuringTesting("123")
  } catch {
    case error: ErrorDuringTesting =>
      println(s"error: ${error.msg}")
  }

}
