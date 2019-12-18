package xieyuheng.cicada_backup

case class Err(msg: String) extends Throwable {

  def cause(cause: Err): Err = {
    Err(
      msg ++
        "------------\n" ++
        cause.msg
    )
  }

}
