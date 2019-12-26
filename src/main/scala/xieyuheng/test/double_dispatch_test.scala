package xieyuheng.test

object double_dispatch_test extends App {

  trait entity_t {
    def collide(that: entity_t): String
  }

  case class entity_one_t() extends entity_t {
    def collide(that: entity_t): String = {
      that.collide(this)
    }

    def collide(that: entity_one_t): String = {
      "entity_one_t entity_one_t"
    }

    def collide(that: entity_two_t): String = {
      "entity_one_t entity_two_t"
    }
  }

  case class entity_two_t() extends entity_t {
    def collide(that: entity_t): String = {
      that.collide(this)
    }

    def collide(that: entity_one_t): String = {
      "entity_two_t entity_one_t"
    }

    def collide(that: entity_two_t): String = {
      "entity_two_t entity_two_t"
    }
  }

  val entity_one = entity_one_t()
  val entity_two = entity_two_t()

  assert(entity_one.collide(entity_one) == "entity_one_t entity_one_t")
  assert(entity_one.collide(entity_two) == "entity_one_t entity_two_t")
  assert(entity_two.collide(entity_one) == "entity_two_t entity_one_t")
  assert(entity_two.collide(entity_two) == "entity_two_t entity_two_t")

}
