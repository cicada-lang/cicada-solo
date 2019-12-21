package xieyuheng.cicada

case class Report(message_list: List[String]) extends Throwable {

  def throw_append(message: String) = {
    throw Report(message_list :+ message)
  }

  def throw_prepend(message: String) = {
    throw Report(message +: message_list)
  }
}
