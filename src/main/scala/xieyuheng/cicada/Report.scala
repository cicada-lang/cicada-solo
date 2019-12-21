package xieyuheng.cicada

case class Report(msg_list: List[String]) extends Throwable {

  def throw_append(msg: String) = {
    throw Report(msg_list :+ msg)
  }

  def throw_prepend(msg: String) = {
    throw Report(msg +: msg_list)
  }

  def print(): Unit = {
    Console.print(Console.RESET)
    Console.print(Console.RED)
    Console.println("------")
    msg_list.foreach {
      case msg =>
        Console.print(s"${msg}")
        Console.println("------")
    }
    Console.print(Console.RESET)
  }

}
