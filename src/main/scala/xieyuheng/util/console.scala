package xieyuheng.util

object console {
  def console_print_with_color_when
    (flag: Boolean)
    (escape_code: String)
    (printer: () => Unit)
      : Unit = {
    if (flag) {
      Console.print(Console.RESET)
      Console.print(escape_code)
      printer()
      Console.print(Console.RESET)
    } else {
      printer()
    }
  }
}
