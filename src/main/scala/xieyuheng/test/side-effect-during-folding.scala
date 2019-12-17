package xieyuheng.test

object side_effect_during_folding extends App {
  var number_list: List[Int] = List()
  val list = List(0, 1, 2, 3)
  val sum = list.foldLeft(0) {
    case (sum, n) =>
      number_list = number_list :+ n
      sum + n
  }
  assert(sum == 6)
  assert(number_list == list)
}
