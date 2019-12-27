package xieyuheng.party

import scala.util.{ Try, Success, Failure }

trait PartechTester {
  def description: String
  def sentences: List[String]
  def non_sentences: List[String]
  def lexer: Lexer
  def start: Rule
  def matcher: Option[Tree => _]

  def test(partech: Partech): Unit = {
    test_sentences(partech)
    test_non_sentences(partech)
    test_matcher(partech)
  }

  def test_sentences(partech: Partech): Unit = {
    val parser = Parser(lexer, start, partech)
    sentences.foreach {
      case sentence =>
        Try {
          parser.parse(sentence)
        } match {
          case Success(_tree) => ()
          case Failure(error: ErrorDuringParsing) =>
            println(s"partech tester fail on sentence")
            println(description)
            println(s"- sentence: ${sentence}")
            println(s"- start: ${start.name}")
            println(s"- error: ${error.message}")
            println(s"- span: ${error.span}")
            throw new Exception()
          case Failure(error) =>
            println(s"- error: ${error}")
            throw new Exception()
        }
    }
  }

  def test_non_sentences(partech: Partech): Unit = {
    val parser = Parser(lexer, start, partech)
    non_sentences.foreach {
      case sentence =>
        Try {
          parser.parse(sentence)
        } match {
          case Success(tree) =>
            println(s"partech tester fail on non-sentence")
            println(description)
            println(s"- non-sentence: ${sentence}")
            println(s"- start: ${start.name}")
            throw new Exception()
          case Failure(_error) => {}
        }
    }
  }

  def test_matcher(partech: Partech): Unit = {
    val parser = Parser(lexer, start, partech)
    sentences.foreach {
      case sentence =>
        Try {
          parser.parse(sentence)
        } match {
          case Success(tree) =>
            matcher match {
              case Some(matcher) =>
                val matched = matcher(tree)
              case None => {}
            }
          case Failure(error: ErrorDuringParsing) =>
            println(s"partech tester fail on matcher")
            println(description)
            println(s"- start: ${start.name}")
            println(s"- sentence: ${sentence}")
            println(s"- error: ${error.message}")
            println(s"- span: ${error.span}")
            throw new Exception()
          case Failure(error) =>
            println(s"- error: ${error}")
            throw new Exception()
        }
    }
  }

}
