use crate::span::Span;
use crate::token::Token;
use crate::error::ErrorDuringParsing;

pub trait Lexer {
    fn word_matcher<'a>(&self, text: &'a str) -> Option<(&'a str, &'a str)>;
    fn ignorer<'a>(&self, text: &'a str) -> &'a str;

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
                        word: left,
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

#[test]
fn test_common_lexer() {
    use crate::predefined::CommonLexer;

    let result = CommonLexer.lex("a b c");
    let tokens = vec![
        Token { word: "a", span: Span { lo: 0, hi: 1 } },
        Token { word: "b", span: Span { lo: 2, hi: 3 } },
        Token { word: "c", span: Span { lo: 4, hi: 5 } },
    ];
    assert_eq!(result, Ok(tokens));

    let result = CommonLexer.lex(r#"a "b" c"#);
    let tokens = vec![
        Token { word: "a", span: Span { lo: 0, hi: 1 } },
        Token { word: "\"b\"", span: Span { lo: 2, hi: 5 } },
        Token { word: "c", span: Span { lo: 6, hi: 7 } },
    ];
    assert_eq!(result, Ok(tokens));

    let result = CommonLexer.lex(r#"a "b c"#);
    assert!(result.is_err());
}
