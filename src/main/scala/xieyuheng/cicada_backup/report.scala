package xieyuheng.cicada_backup

case class Report(msg_list: List[String]) extends Throwable {

  def append(msg: String): Report = {
    Report(msg_list :+ msg)
  }

  def prepend(msg: String): Report = {
    Report(msg +: msg_list)
  }

}
