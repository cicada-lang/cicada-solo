package xieyuheng.cicada

import xieyuheng.util.console._

case class ErrorReport(message_list: List[String]) extends Throwable {

  def throw_append(message: String) = {
    throw ErrorReport(message_list :+ message)
  }

  def throw_prepend(message: String) = {
    throw ErrorReport(message +: message_list)
  }

  override def toString: String = {
    var s = ""
    s += "------\n"
    message_list.foreach {
      case message =>
        s += s"${message}"
        s += "------\n"
    }
    s
  }

}
