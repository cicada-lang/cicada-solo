package xieyuheng.test

object double_dispatch_test extends App {

  trait entity_t {
    def collide(that: entity_t): Unit
  }

  case class entity_one_t() extends entity_t {
    def collide(that: entity_t): Unit = {
      that.collide(this)
    }

    def collide(that: entity_one_t): Unit = {
      println("entity_one_t entity_one_t")
    }

    def collide(that: entity_two_t): Unit = {
      println("entity_one_t entity_two_t")
    }
  }

  case class entity_two_t() extends entity_t {
    def collide(that: entity_t): Unit = {
      that.collide(this)
    }

    def collide(that: entity_one_t): Unit = {
      println("entity_two_t entity_one_t")
    }

    def collide(that: entity_two_t): Unit = {
      println("entity_two_t entity_two_t")
    }
  }

  val entity_one = entity_one_t()
  val entity_two = entity_two_t()

  entity_one.collide(entity_one)
  entity_one.collide(entity_two)
  entity_two.collide(entity_one)
  entity_two.collide(entity_two)

}
