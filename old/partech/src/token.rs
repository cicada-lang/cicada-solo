use crate::span::Span;

#[derive(Clone)]
#[derive(Debug)]
#[derive(PartialEq, Eq)]
pub struct Token <'a> {
    pub word: &'a str,
    pub span: Span,
}
