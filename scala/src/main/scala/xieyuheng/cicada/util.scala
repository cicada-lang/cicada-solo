package xieyuheng.cicada

import java.util.UUID
import collection.immutable.ListMap

import evaluate._
import pretty._

object util {

  def unique_var_from(base: String): NeutralVar = {
    val uuid: UUID = UUID.randomUUID()
    NeutralVar(s"${base}#${uuid}")
  }

}
