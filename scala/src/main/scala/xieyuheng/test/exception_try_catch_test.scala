package xieyuheng.test

object exception_try_catch_test extends App {

  case class Error1(msg: String) extends Throwable
  case class Error2(msg: String) extends Throwable

  val error_message =
    try {
      throw Error1("Error1")
      throw Error2("Error2")
    } catch {
      case error: Error1 =>
        error.msg
      case error: Error2 =>
        error.msg
    }

  assert(error_message == "Error1")

}
