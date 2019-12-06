use crate::span::Span;

#[derive(Clone)]
#[derive(Debug)]
#[derive(PartialEq, Eq)]
pub struct Token {
    string: String,
    span: Span,
}
