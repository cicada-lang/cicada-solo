package xieyuheng.util

object err {

  case class Err(msg: String) {

    def cause(cause: Err): Err = {
      Err(
        msg ++
          "------------\n" ++
          cause.msg
      )
    }

  }

  def result_maybe_err[A](result: Either[Err, A], err: Err): Either[Err, A] = {
    result match {
      case Right(value) => Right(value)
      case Left(cause) => Left(err.cause(cause))
    }
  }

}
