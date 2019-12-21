package xieyuheng.test

object exception_try_catch extends App {

  case class Error1(msg: String) extends Throwable
  case class Error2(msg: String) extends Throwable

  try {
    throw new Error1("Error1")
    throw new Error2("Error2")
  } catch {
    case error: Error1 =>
      println(s"error1: ${error.msg}")
    case error: Error2 =>
      println(s"error2: ${error.msg}")
  }

}
