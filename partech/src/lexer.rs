use crate::span::Span;
use crate::token::Token;
use crate::error::ErrorDuringParsing;

pub trait Lexer {
    fn word_matcher<'a>(&self, text: &str) -> Option<(&'a str, &'a str)>;
    fn ignorer<'a>(&self, text: &str) -> &'a str;

    fn lex<'a>(&self, text: &'a str) -> Result<Vec<Token<'a>>, ErrorDuringParsing> {
        let mut remain = text;
        let mut tokens = vec![];

        while remain.len() > 0 {
            remain = self.ignorer(remain);
            match self.word_matcher(remain) {
                Some((left, right)) => {
                    let hi = text.len() - right.len();
                    let lo = hi - left.len();
                    tokens.push(Token {
                        string: left,
                        span: Span { lo, hi },
                    });
                    remain = right;
                }
                None => {
                    let hi = text.len();
                    let lo = text.len() - remain.len();
                    return Err(ErrorDuringParsing {
                        msg: format!("The lexer failed because of `word_matcher` matches nothing."),
                        span: Span { lo, hi },
                    })
                }
            }
        }

        Ok(tokens)
    }
}
