package xieyuheng.cicada

import java.util.UUID
import collection.immutable.ListMap

import eval._
import pretty._

object util {

  def fresh_var_from(name: String): NeutralVar = {
    val uuid: UUID = UUID.randomUUID()
    NeutralVar(s"${name}#${uuid}")
  }

}
